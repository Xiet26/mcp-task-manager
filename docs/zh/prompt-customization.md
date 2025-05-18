[English](../en/prompt-customization.md) | [中文](../zh/prompt-customization.md)

# Prompt Customization Guide

## Overview

This system allows users to customize the guidance content (prompt) of each tool function through environment variables. This provides great flexibility, enabling you to adjust the behavior of the AI assistant according to specific needs without modifying the code. There are two customization methods:

1. **Override mode**: Completely replace the original prompt
2. **Append mode**: Add new content on top of the original prompt

## Environment Variable Naming Rules

- Override mode: `MCP_PROMPT_[FUNCTION_NAME]`
- Append mode: `MCP_PROMPT_[FUNCTION_NAME]_APPEND`

Where `[FUNCTION_NAME]` is the name of the tool function, in uppercase. For example, for the task planning function `planTask`, the corresponding environment variable name is `MCP_PROMPT_PLAN_TASK`.

## Multi-language Prompt Template Support

Shrimp Task Manager supports prompt templates in multiple languages, which can be set via the `TEMPLATES_USE` environment variable:

- Currently supported languages: `en` (English) and `zh` (Traditional Chinese)
- Default is `en` (English)

### Switch Language

Set in the `mcp.json` configuration:

```json
"env": {
  "TEMPLATES_USE": "zh"  // Use Traditional Chinese templates
}
```

Or set in the `.env` file:

```
TEMPLATES_USE=zh
```

### Custom Templates

You can create your own template set:

1. Copy the existing template set (such as `src/prompts/templates_en` or `src/prompts/templates_zh`) to the directory specified by `DATA_DIR`
2. Rename the copied directory (e.g.: `my_templates`)
3. Modify the template files to suit your needs
4. Set the `TEMPLATES_USE` environment variable to your template directory name:

```json
"env": {
  "DATA_DIR": "/path/to/project/data",
  "TEMPLATES_USE": "my_templates"
}
```

The system will prioritize your custom templates. If a specific template file is not found, it will fall back to the built-in English template.

## Supported Tool Functions

All major functions in the system support customizing prompts via environment variables:

| Function Name      | Env Var Prefix                  | Description      |
| ------------------ | ------------------------------ | --------------- |
| `planTask`         | `MCP_PROMPT_PLAN_TASK`          | Task Planning    |
| `analyzeTask`      | `MCP_PROMPT_ANALYZE_TASK`       | Task Analysis    |
| `reflectTask`      | `MCP_PROMPT_REFLECT_TASK`       | Solution Review  |
| `splitTasks`       | `MCP_PROMPT_SPLIT_TASKS`        | Task Splitting   |
| `executeTask`      | `MCP_PROMPT_EXECUTE_TASK`       | Task Execution   |
| `verifyTask`       | `MCP_PROMPT_VERIFY_TASK`        | Task Verification|
| `listTasks`        | `MCP_PROMPT_LIST_TASKS`         | List Tasks       |
| `queryTask`        | `MCP_PROMPT_QUERY_TASK`         | Query Tasks      |
| `getTaskDetail`    | `MCP_PROMPT_GET_TASK_DETAIL`    | Get Task Detail  |
| `processThought`   | `MCP_PROMPT_PROCESS_THOUGHT`    | Thought Process  |
| `initProjectRules` | `MCP_PROMPT_INIT_PROJECT_RULES` | Init Project Rules|

## Environment Variable Configuration Methods

There are two main configuration methods:

### 1. Set environment variables via `.env` file

1. Copy `.env.example` in the project root directory and rename it to `.env`
2. Add the required environment variable configuration
3. The application will automatically load these environment variables at startup

```
# Example .env file
MCP_PROMPT_PLAN_TASK=Custom prompt content
MCP_PROMPT_ANALYZE_TASK=Custom analysis prompt content
```

> Note: Make sure the `.env` file is ignored by version control (add to `.gitignore`), especially if it contains sensitive information.

### 2. Set environment variables directly in the mcp.json configuration file

You can also set environment variables directly in the Cursor IDE's `mcp.json` configuration file, so you don't need to create a separate `.env` file:

```json
{
  "mcpServers": {
    "shrimp-task-manager": {
      "command": "node",
      "args": ["/path/to/mcp-shrimp-task-manager/dist/index.js"],
      "env": {
        "DATA_DIR": "/path/to/project/data",
        "MCP_PROMPT_PLAN_TASK": "Custom task planning prompt",
        "MCP_PROMPT_EXECUTE_TASK_APPEND": "Additional task execution guidance"
      }
    }
  }
}
```

This method has the advantage of managing prompt configuration together with other MCP configurations, which is especially suitable for using different prompts for different projects.

## Usage Examples

### Override Mode Example

```
# Completely replace the PLAN_TASK prompt in the .env file
MCP_PROMPT_PLAN_TASK=## Custom Task Planning\n\nPlease plan the task based on the following information:\n\n{description}\n\nRequirements: {requirements}\n
```

Or configure in mcp.json:

```json
"env": {
  "MCP_PROMPT_PLAN_TASK": "## Custom Task Planning\n\nPlease plan the task based on the following information:\n\n{description}\n\nRequirements: {requirements}\n"
}
```

### Append Mode Example

```
# Append content to the original PLAN_TASK prompt in the .env file
MCP_PROMPT_PLAN_TASK_APPEND=\n\n## Additional Guidance\n\nPlease pay special attention to the following:\n1. Prioritize task dependencies\n2. Minimize task coupling
```

Or configure in mcp.json:

```json
"env": {
  "MCP_PROMPT_PLAN_TASK_APPEND": "\n\n## Additional Guidance\n\nPlease pay special attention to the following:\n1. Prioritize task dependencies\n2. Minimize task coupling"
}
```

## Dynamic Parameter Support

Custom prompts can also use defined dynamic parameters, using the `{paramName}` syntax. The system will replace these placeholders with actual parameter values during processing.

Supported parameters for each function are as follows:

### planTask Supported Parameters

- `{description}` - Task description
- `{requirements}` - Task requirements
- `{existingTasksReference}` - Whether to reference existing tasks
- `{completedTasks}` - List of completed tasks
- `{pendingTasks}` - List of pending tasks
- `{memoryDir}` - Task memory storage directory

### analyzeTask Supported Parameters

- `{summary}` - Task summary
- `{initialConcept}` - Initial concept
- `{previousAnalysis}` - Previous analysis result

### reflectTask Supported Parameters

- `{summary}` - Task summary
- `{analysis}` - Analysis result

### splitTasks Supported Parameters

- `{updateMode}` - Update mode
- `{createdTasks}` - Created tasks
- `{allTasks}` - All tasks

### executeTask Supported Parameters

- `{task}` - Task details
- `{complexityAssessment}` - Complexity assessment result
- `{relatedFilesSummary}` - Related files summary
- `{dependencyTasks}` - Dependency tasks
- `{potentialFiles}` - Potential related files

### verifyTask Supported Parameters

- `{task}` - Task details

### listTasks Supported Parameters

- `{status}` - Task status
- `{tasks}` - Tasks grouped by status
- `{allTasks}` - All tasks

### queryTask Supported Parameters

- `{query}` - Query content
- `{isId}` - Whether it is an ID query
- `{tasks}` - Query results
- `{totalTasks}` - Total number of results
- `{page}` - Current page number
- `{pageSize}` - Page size
- `{totalPages}` - Total number of pages

### getTaskDetail Supported Parameters

- `{taskId}` - Task ID
- `{task}` - Task details
- `{error}` - Error message (if any)

## Advanced Customization Cases

### Example 1: Add Brand Customization Prompts

Suppose you want to add company-specific brand information and guidelines to all task execution guides:

```
# Configure in .env file
MCP_PROMPT_EXECUTE_TASK_APPEND=\n\n## Company Specific Guidelines\n\nWhen executing tasks, please follow these principles:\n1. Keep code consistent with company style guide\n2. All new features must have corresponding unit tests\n3. Documentation must use company standard templates\n4. Ensure all UI elements comply with brand design specifications
```

### Example 2: Adjust Task Analysis Style

Suppose you want to make task analysis more security-oriented:

```
# Configure in .env file
MCP_PROMPT_ANALYZE_TASK=## Security-Oriented Task Analysis\n\nPlease conduct a comprehensive security analysis for the following task:\n\n**Task Summary:**\n{summary}\n\n**Initial Concept:**\n{initialConcept}\n\nDuring the analysis, please pay special attention to:\n1. Code injection risks\n2. Permission management issues\n3. Data validation and sanitization\n4. Security risks of third-party dependencies\n5. Possibility of configuration errors\n\nFor each potential issue, please provide:\n- Problem description\n- Impact level (Low/Medium/High)\n- Suggested solution\n\n{previousAnalysis}
```

Or configure in mcp.json:

```json
"env": {
  "MCP_PROMPT_ANALYZE_TASK": "## Security-Oriented Task Analysis\n\nPlease conduct a comprehensive security analysis for the following task:\n\n**Task Summary:**\n{summary}\n\n**Initial Concept:**\n{initialConcept}\n\nDuring the analysis, please pay special attention to:\n1. Code injection risks\n2. Permission management issues\n3. Data validation and sanitization\n4. Security risks of third-party dependencies\n5. Possibility of configuration errors\n\nFor each potential issue, please provide:\n- Problem description\n- Impact level (Low/Medium/High)\n- Suggested solution\n\n{previousAnalysis}"
}
```

### Example 3: Simplify Task List Display

If you find the default task list too detailed, you can simplify the display:

```
# Configure in .env file
MCP_PROMPT_LIST_TASKS=# Task Overview\n\n## Pending Tasks\n{tasks.pending}\n\n## In Progress Tasks\n{tasks.in_progress}\n\n## Completed Tasks\n{tasks.completed}
```

Or configure in mcp.json:

```json
"env": {
  "MCP_PROMPT_LIST_TASKS": "# Task Overview\n\n## Pending Tasks\n{tasks.pending}\n\n## In Progress Tasks\n{tasks.in_progress}\n\n## Completed Tasks\n{tasks.completed}"
}
```

## Best Practices

1. **Adjust gradually**: Start with small changes and make sure the system still works after each modification.

2. **Save configuration**: Save valid environment variable configurations to the project's `.env.example` file for team reference.

3. **Pay attention to format**: Ensure correct line breaks and formatting in prompts, especially when using quoted environment variables.

4. **Test and verify**: Test custom prompts in different scenarios to ensure they work properly in all cases.

5. **Consider task flow**: When modifying prompts, consider the entire task flow to ensure consistency across different stages.

## Troubleshooting

- **Environment variables not effective**: Make sure you have set the environment variables correctly and restarted the application after setting them.

- **Formatting issues**: Check whether line breaks and special characters in environment variables are properly escaped.

- **Parameter replacement failed**: Make sure the parameter names you use are consistent with those supported by the system, including case.

- **Restore default settings**: If custom prompts cause problems, you can delete the corresponding environment variables to restore the default settings.

## Appendix: Default Prompt Reference

To help you better customize prompts, here are some references for the system's default prompts. You can modify or extend them based on these:

### planTask Default Prompt Example

```
## Task Planning Guide

Based on the following description and requirements, please develop a detailed task plan:

description:
{description}

requirements:
{requirements}

...
```

> Note: The full default prompt content can be found in the corresponding template files under the project's `src/prompts/templates` directory.
