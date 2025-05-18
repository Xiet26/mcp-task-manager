import { RelatedFile, RelatedFileType } from "../types/index.js";

/**
 * Generate a summary of the contents of files related to the task
 *
 * This function generates a summary of files based on the provided RelatedFile object list, without actually reading the file contents.
 * This is a lightweight implementation that generates a formatted summary based only on file metadata (such as path, type, description, etc.),
 * suitable for scenarios where file context information needs to be provided but actual file content does not need to be accessed.
 *
 * @param relatedFiles List of related files - an array of RelatedFile objects containing file paths, types, descriptions, etc.
 * @param maxTotalLength Maximum total length of the summary content - controls the total number of characters generated to avoid excessive return content
 * @returns An object containing two fields:
 *   - content: Detailed file information, including basic information and prompt messages for each file
 *   - summary: Concise overview of the file list, suitable for quick browsing
 */
export async function loadTaskRelatedFiles(
  relatedFiles: RelatedFile[],
  maxTotalLength: number = 15000 // Control the total length of generated content
): Promise<{ content: string; summary: string }> {
  if (!relatedFiles || relatedFiles.length === 0) {
    return {
      content: "",
      summary: "No related files",
    };
  }

  let totalContent = "";
  let filesSummary = `## Summary of Related Files (Total ${relatedFiles.length} files)\n\n`;
  let totalLength = 0;

  // Sort by file type priority (process files to be modified first)
  const priorityOrder: Record<RelatedFileType, number> = {
    [RelatedFileType.TO_MODIFY]: 1,
    [RelatedFileType.REFERENCE]: 2,
    [RelatedFileType.DEPENDENCY]: 3,
    [RelatedFileType.CREATE]: 4,
    [RelatedFileType.OTHER]: 5,
  };

  const sortedFiles = [...relatedFiles].sort(
    (a, b) => priorityOrder[a.type] - priorityOrder[b.type]
  );

  // Process each file
  for (const file of sortedFiles) {
    if (totalLength >= maxTotalLength) {
      filesSummary += `\n### Context length limit reached, some files not loaded\n`;
      break;
    }

    // Generate basic file information
    const fileInfo = generateFileInfo(file);

    // Add to total content
    const fileHeader = `\n### ${file.type}: ${file.path}${
      file.description ? ` - ${file.description}` : ""
    }${
      file.lineStart && file.lineEnd
        ? ` (lines ${file.lineStart}-${file.lineEnd})`
        : ""
    }\n\n`;

    totalContent += fileHeader + "```\n" + fileInfo + "\n```\n\n";
    filesSummary += `- **${file.path}**${
      file.description ? ` - ${file.description}` : ""
    } (${fileInfo.length} chars)\n`;

    totalLength += fileInfo.length + fileHeader.length + 8; // 8 for "```\n" and "\n```"
  }

  return {
    content: totalContent,
    summary: filesSummary,
  };
}

/**
 * Generate a summary of basic file information
 *
 * Generates a formatted information summary based on the file's metadata, including file path, type, and related prompts.
 * Does not read the actual file content, only generates information based on the provided RelatedFile object.
 *
 * @param file Related file object - contains basic information such as file path, type, description, etc.
 * @returns Formatted file information summary text
 */
function generateFileInfo(file: RelatedFile): string {
  let fileInfo = `File: ${file.path}\n`;
  fileInfo += `Type: ${file.type}\n`;

  if (file.description) {
    fileInfo += `Description: ${file.description}\n`;
  }

  if (file.lineStart && file.lineEnd) {
    fileInfo += `Line range: ${file.lineStart}-${file.lineEnd}\n`;
  }

  fileInfo += `To view the actual content, please check the file directly: ${file.path}\n`;

  return fileInfo;
}
