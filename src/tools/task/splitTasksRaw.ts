import { z } from "zod";
import {
  getAllTasks,
  batchCreateOrUpdateTasks,
  clearAllTasks as modelClearAllTasks,
} from "../../models/taskModel.js";
import { RelatedFileType, Task } from "../../types/index.js";
import { getSplitTasksPrompt } from "../../prompts/index.js";

// 拆分任務工具
export const splitTasksRawSchema = z.object({
  updateMode: z
    .enum(["append", "overwrite", "selective", "clearAllTasks"])
    .describe(
      "Task update mode: 'append' (keep all existing tasks and add new ones), 'overwrite' (clear all unfinished tasks and completely replace, keep completed tasks), 'selective' (smart update: match and update existing tasks by name, keep tasks not in the list, recommended for fine-tuning), 'clearAllTasks' (clear all tasks and create backup). Default is 'clearAllTasks' mode, use other modes only if user requests change or plan modification."
    ),
  tasksRaw: z
    .string()
    .describe(
      "Structured task list. Each task should be atomic and have clear completion criteria. Avoid overly simple tasks; simple modifications can be combined with others. Avoid too many tasks. Example: [{name: 'Concise and clear task name, should clearly express the task purpose', description: 'Detailed task description, including implementation points, technical details, and acceptance criteria', implementationGuide: 'Specific implementation method and steps for this task, refer to previous analysis for concise pseudocode', notes: 'Additional notes, special handling requirements or implementation suggestions (optional)', dependencies: ['Full name of prerequisite tasks this task depends on'], relatedFiles: [{path: 'File path', type: 'File type (TO_MODIFY: to modify, REFERENCE: reference, CREATE: to create, DEPENDENCY: dependency, OTHER: other)', description: 'File description', lineStart: 1, lineEnd: 100}], verificationCriteria: 'Verification criteria and inspection method for this task'}, {name: 'Task 2', description: 'Task 2 description', implementationGuide: 'Task 2 implementation', notes: 'Additional notes, special handling requirements or implementation suggestions (optional)', dependencies: ['Task 1'], relatedFiles: [{path: 'File path', type: 'File type (TO_MODIFY: to modify, REFERENCE: reference, CREATE: to create, DEPENDENCY: dependency, OTHER: other)', description: 'File description', lineStart: 1, lineEnd: 100}], verificationCriteria: 'Verification criteria and inspection method for this task'}]"
    ),
  globalAnalysisResult: z
    .string()
    .optional()
    .describe("Final task goal, from previous analysis, applies to all tasks as a common part"),
});

const tasksSchema = z
  .array(
    z.object({
      name: z
        .string()
        .max(100, {
          message: "Task name too long, please limit to 100 characters or less",
        })
        .describe("Concise and clear task name, should clearly express the task purpose"),
      description: z
        .string()
        .min(10, {
          message: "Task description too short, please provide more details to ensure understanding",
        })
        .describe("Detailed task description, including implementation points, technical details, and acceptance criteria"),
      implementationGuide: z
        .string()
        .describe(
          "Specific implementation method and steps for this task, refer to previous analysis for concise pseudocode"
        ),
      dependencies: z
        .array(z.string())
        .optional()
        .describe(
          "List of prerequisite task IDs or names this task depends on. Supports both reference methods. Name reference is more intuitive. It is a string array."
        ),
      notes: z
        .string()
        .optional()
        .describe("Additional notes, special handling requirements or implementation suggestions (optional)"),
      relatedFiles: z
        .array(
          z.object({
            path: z
              .string()
              .min(1, {
                message: "File path cannot be empty",
              })
              .describe("File path, can be relative to project root or absolute path"),
            type: z
              .nativeEnum(RelatedFileType)
              .describe(
                "File type (TO_MODIFY: to modify, REFERENCE: reference, CREATE: to create, DEPENDENCY: dependency, OTHER: other)"
              ),
            description: z
              .string()
              .min(1, {
                message: "File description cannot be empty",
              })
              .describe("File description, used to explain the purpose and content of the file"),
            lineStart: z
              .number()
              .int()
              .positive()
              .optional()
              .describe("Start line of related code block (optional)"),
            lineEnd: z
              .number()
              .int()
              .positive()
              .optional()
              .describe("End line of related code block (optional)"),
          })
        )
        .optional()
        .describe(
          "List of files related to the task, used to record code files, reference materials, files to be created, etc. (optional)"
        ),
      verificationCriteria: z
        .string()
        .optional()
        .describe("Verification criteria and inspection method for this task"),
    })
  )
  .min(1, {
    message: "Please provide at least one task",
  })
  .describe(
    "Structured task list. Each task should be atomic and have clear completion criteria. Avoid overly simple tasks; simple modifications can be combined with others. Avoid too many tasks."
  );

export async function splitTasksRaw({
  updateMode,
  tasksRaw,
  globalAnalysisResult,
}: z.infer<typeof splitTasksRawSchema>) {
  let tasks: Task[] = [];
  try {
    tasks = JSON.parse(tasksRaw);
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text:
            "tasksRaw parameter format error, please ensure correct format, please try to fix the error, if the text is too long to be repaired, please call in batches, this can avoid long messages causing problems to repair, error message: " +
            (error instanceof Error ? error.message : String(error)),
        },
      ],
    };
  }

  // 使用 tasksSchema 驗證 tasks
  const tasksResult = tasksSchema.safeParse(tasks);
  if (!tasksResult.success) {
    // 返回錯誤訊息
    return {
      content: [
        {
          type: "text" as const,
          text:
            "tasks parameter format error, please ensure correct format, error message: " +
            tasksResult.error.message,
        },
      ],
    };
  }

  try {
    // 檢查 tasks 裡面的 name 是否有重複
    const nameSet = new Set();
    for (const task of tasks) {
      if (nameSet.has(task.name)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "tasks parameter exists duplicate task name, please ensure each task name is unique",
            },
          ],
        };
      }
      nameSet.add(task.name);
    }

    // 根據不同的更新模式處理任務
    let message = "";
    let actionSuccess = true;
    let backupFile = null;
    let createdTasks: Task[] = [];
    let allTasks: Task[] = [];

    // 將任務資料轉換為符合batchCreateOrUpdateTasks的格式
    const convertedTasks = tasks.map((task) => ({
      name: task.name,
      description: task.description,
      notes: task.notes,
      dependencies: task.dependencies as unknown as string[],
      implementationGuide: task.implementationGuide,
      verificationCriteria: task.verificationCriteria,
      relatedFiles: task.relatedFiles?.map((file) => ({
        path: file.path,
        type: file.type as RelatedFileType,
        description: file.description,
        lineStart: file.lineStart,
        lineEnd: file.lineEnd,
      })),
    }));

    // 處理 clearAllTasks 模式
    if (updateMode === "clearAllTasks") {
      const clearResult = await modelClearAllTasks();

      if (clearResult.success) {
        message = clearResult.message;
        backupFile = clearResult.backupFile;

        try {
          // 清空任務後再創建新任務
          createdTasks = await batchCreateOrUpdateTasks(
            convertedTasks,
            "append",
            globalAnalysisResult
          );
          message += `\nSuccessfully created ${createdTasks.length} new tasks.`;
        } catch (error) {
          actionSuccess = false;
          message += `\nError occurred when creating new tasks: ${
            error instanceof Error ? error.message : String(error)
          }`;
        }
      } else {
        actionSuccess = false;
        message = clearResult.message;
      }
    } else {
      // 對於其他模式，直接使用 batchCreateOrUpdateTasks
      try {
        createdTasks = await batchCreateOrUpdateTasks(
          convertedTasks,
          updateMode,
          globalAnalysisResult
        );

        // 根據不同的更新模式生成消息
        switch (updateMode) {
          case "append":
            message = `Successfully added ${createdTasks.length} new tasks.`;
            break;
          case "overwrite":
            message = `Successfully cleared unfinished tasks and created ${createdTasks.length} new tasks.`;
            break;
          case "selective":
            message = `Successfully selectively updated/created ${createdTasks.length} tasks.`;
            break;
        }
      } catch (error) {
        actionSuccess = false;
        message = `Task creation failed: ${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    }

    // 獲取所有任務用於顯示依賴關係
    try {
      allTasks = await getAllTasks();
    } catch (error) {
      allTasks = [...createdTasks]; // 如果獲取失敗，至少使用剛創建的任務
    }

    // 使用prompt生成器獲取最終prompt
    const prompt = getSplitTasksPrompt({
      updateMode,
      createdTasks,
      allTasks,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
      ephemeral: {
        taskCreationResult: {
          success: actionSuccess,
          message,
          backupFilePath: backupFile,
        },
      },
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text:
            "An error occurred when executing task splitting: " +
            (error instanceof Error ? error.message : String(error)),
        },
      ],
    };
  }
}
