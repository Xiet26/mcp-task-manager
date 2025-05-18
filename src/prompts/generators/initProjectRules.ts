/**
 * initProjectRules prompt generator
 * Responsible for combining template and parameters into the final prompt
 */

import { loadPrompt, loadPromptFromTemplate } from "../loader.js";
/**
 * initProjectRules prompt parameter interface
 */
export interface InitProjectRulesPromptParams {
  // No extra parameters for now, can be extended in the future
}

/**
 * Get the full prompt for initProjectRules
 * @param params Prompt parameters (optional)
 * @returns Generated prompt
 */
export function getInitProjectRulesPrompt(
  params?: InitProjectRulesPromptParams
): string {
  const indexTemplate = loadPromptFromTemplate("initProjectRules/index.md");

  // Load possible custom prompt (override or append via environment variable)
  return loadPrompt(indexTemplate, "INIT_PROJECT_RULES");
}
