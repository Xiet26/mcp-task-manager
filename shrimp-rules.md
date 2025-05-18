# Development Guidelines

This document is a dedicated specification for AI Agents performing development tasks in the `mcp-shrimp-task-manager` project.

## 1. Project Overview

- **Project Name**: `mcp-shrimp-task-manager`
- **Purpose**: A task management tool designed for AI Agents, emphasizing chain-of-thought, reflection, and style consistency. It converts natural language into structured development tasks and features dependency tracking and iterative optimization.
- **Tech Stack**:
  - Main language: TypeScript
  - Runtime: Node.js (ES Module)
  - Main frameworks/libraries: Express.js (for possible API or WebGUI), Zod (for data validation)
  - Package manager: npm
- **Core Features**:
  - Natural language task parsing
  - Structured task generation and management
  - Task dependency tracking
  - Task execution and verification assistance
  - Integration with AI Agent's thought process

## 2. Project Structure

- **Main source code directory**: `src/`
  - `src/index.ts`: Main application entry point or module export. **Be cautious when modifying this file due to its wide impact.**
  - `src/utils/`: General utility functions.
  - `src/types/`: TypeScript type definitions. **When adding or modifying types, ensure consistency with Zod schemas (if applicable).**
  - `src/tools/`: Project-specific tools or modules integrating with external services.
  - `src/models/`: Data model definitions (possibly related to Zod schemas).
  - `src/prompts/`: Prompt templates for AI interaction. **When modifying or adding prompts, consider the potential impact on AI Agent behavior.**
  - `src/public/`: WebGUI or other static resources.
  - `src/tests/`: Unit and integration tests.
- **Build output directory**: `dist/` (generated automatically by `tsc`, **do not manually modify this directory**).
- **Configuration files**:
  - `package.json`: Project dependencies and scripts. **After adding dependencies, you must run `npm install`.**
  - `tsconfig.json`: TypeScript compiler settings. **Do not modify the `"strict": true` setting unless absolutely necessary.**
  - `.env.example` & `.env`: Environment variable settings. **Sensitive information must not be committed to version control.**
- **Documents**:
  - `README.md`: Main project documentation.
  - `docs/`: May contain more detailed architecture, API docs, etc.
  - `CHANGELOG.md`: Version change log. **Must be updated before each new release.**
  - `data/WebGUI.md`: Contains the Task Manager UI link.

## 3. Code Standards

### 3.1. Naming Conventions

- **Variables and functions**: Use camelCase.
  - _Example (allowed)_: `const taskName = "example"; function processTask() {}`
  - _Example (not allowed)_: `const Task_Name = "example"; function Process_Task() {}`
- **Classes and interfaces**: Use PascalCase.
  - _Example (allowed)_: `class TaskManager {}; interface ITaskOptions {}`
  - _Example (not allowed)_: `class taskManager {}; interface iTaskOptions {}`
- **File names**: Use camelCase or kebab-case for `.ts` files.
  - _Example (allowed)_: `taskProcessor.ts`, `task-utils.ts`
  - _Example (not allowed)_: `TaskProcessor.ts`, `task_utils.ts`
- **Constants**: Use UPPER_SNAKE_CASE.
  - _Example (allowed)_: `const MAX_RETRIES = 3;`
  - _Example (not allowed)_: `const maxRetries = 3;`

### 3.2. Formatting Requirements

- **Indentation**: Use 2 spaces. **Tabs are forbidden.**
- **Semicolons**: Every statement must end with a semicolon.
- **Quotes**: Prefer single quotes (`'`) for strings, unless the string itself contains a single quote.
  - _Example (allowed)_: `const message = 'Hello World'; const complex = "It\'s complex";`
  - _Example (not allowed)_: `const message = "Hello World";`
- **Max line length**: Recommended not to exceed 120 characters.
- **Comments**:
  - Single-line comments use `//`.
  - Multi-line comments use `/* ... */`.
  - JSDoc style comments should be used for public functions, classes, and methods.
    - _Example (allowed)_:
      ```typescript
      /**
       * Processes a given task.
       * @param taskId The ID of the task to process.
       * @returns True if successful, false otherwise.
       */
      function processTaskById(taskId: string): boolean {
        // implementation
        return true;
      }
      ```

### 3.3. TypeScript Specific Standards

- **Type annotations**: All function parameters, return values, and variable declarations should have explicit type annotations. **The use of `any` is forbidden except in extremely rare and unavoidable cases, and must be accompanied by a comment explaining why.**
  - _Example (allowed)_: `function greet(name: string): string { return `Hello, ${name}`; }`
  - _Example (not allowed)_: `function greet(name): any { return "Hello, " + name; }`
- **Interfaces and type aliases**: Prefer interfaces for object shapes, use type aliases for unions, tuples, or other complex types.
- **ES Module**: Use `import` and `export` syntax.
  - _Example (allowed)_: `import { Task } from './models/task'; export class TaskService {}`
  - _Example (not allowed)_: `const Task = require('./models/task'); module.exports = TaskService;`
- **Strict mode**: The project has `"strict": true` enabled. All TypeScript strict mode errors must be resolved.

## 4. Feature Implementation Standards

### 4.1. General Principles

- **Single Responsibility Principle (SRP)**: Each function and class should have only one responsibility.
- **Keep It Simple (KISS)**: Avoid overly complex solutions.
- **Reuse**: Extract common logic into reusable functions or classes, store in `src/utils/` or relevant modules whenever possible.
- **Error handling**:
  - Use `try...catch` for expected errors.
  - For critical operations, provide clear error messages.
  - Consider using custom error classes for richer error information.
- **Logging**:
  - Add logs for critical operations, error handling, and important state changes.
  - Consider using structured logging.
  - **Do not log sensitive information (such as passwords, API Keys) in logs.**

### 4.2. Zod Usage

- Data structure definitions in `src/models/` or `src/types/` should preferably use Zod schemas for definition and validation.
- Zod schemas should be kept in sync with TypeScript types. You can use `z.infer<typeof schema>` to generate types.

  - _Example (allowed)_:

    ```typescript
    import { z } from "zod";

    export const TaskSchema = z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      description: z.string().optional(),
    });

    export type Task = z.infer<typeof TaskSchema>;
    ```

### 4.3. Express.js Usage (if API/WebGUI)

- Route definitions should be clear and follow RESTful principles (if API).
- Middleware should be well organized, e.g., error handling middleware, logging middleware, etc.
- All external input (request parameters, body, query) **must** be validated by Zod or similar mechanisms.

## 5. Framework/Plugin/Third-party Library Usage Standards

- **Adding dependencies**:
  - **Must** evaluate the necessity, maintenance status, and security of the dependency first.
  - Use `npm install <package-name>` (for runtime dependencies) or `npm install --save-dev <package-name>` (for development dependencies).
  - **Must** specify explicit version ranges in `package.json` (e.g., `^1.2.3` or `~1.2.3`), avoid using `*`.
- **Updating dependencies**: Regularly check and update dependencies to the latest stable version for security patches and new features. Assess potential breaking changes before updating.
- **Removing dependencies**: If a dependency is no longer needed, use `npm uninstall <package-name>` to remove it and remove related references from the code.

## 6. Workflow Standards

### 6.1. Development Workflow

1.  **Understand the task**: Carefully read the task description, requirements, and acceptance criteria.
2.  **Branch management**: Create a new feature branch from the latest `main` (or `develop`) branch. Branch names should be concise and clear, e.g., `feature/add-task-editing` or `fix/login-bug`.
3.  **Coding and testing**:
    - Code according to this specification.
    - **Must** write unit tests for new features or bug fixes (stored in `src/tests/`).
    - Run `npm run build` to ensure the code compiles successfully.
    - Run `npm run dev` or `npm run start` locally for testing.
4.  **Code commit**:
    - Git commit messages should follow the Conventional Commits specification (e.g., `feat: add user authentication`, `fix: resolve issue with task sorting`).
    - **Do not commit code containing `console.log` or other debug messages to the main branch.**
5.  **Pull Request (PR)**:
    - Push the feature branch to the remote repository and create a Pull Request to the `main` (or `develop`) branch.
    - PR descriptions should clearly explain the changes and reasons.
6.  **Code Review**: Wait for other developers or AI Agent to review the code.
7.  **Merge and deploy**: After passing code review, merge the PR. Deployment process depends on project settings.

### 6.2. Version Control (Git)

- **Main branches**:
  - `main`: Represents the stable and deployable product version.
  - `develop` (if used): Represents the latest development version.
- **Commit frequency**: Commit frequently with meaningful changes.
- **Conflict resolution**: When merging or rebasing branches, if conflicts occur, **must** resolve them carefully to ensure code correctness and completeness.

### 6.3. CHANGELOG Update

- Before releasing a new version, **must** update `CHANGELOG.md`.
- The record should include version number, release date, and a list of new features, bug fixes, and major changes.

## 7. Key File Interaction Standards

- **Modifying `src/types/` or `src/models/` (especially Zod schemas)**:
  - **Must** check and update all files referencing these types or schemas to ensure type consistency.
  - **Must** re-run related tests.
- **Modifying `src/index.ts`**:
  - If you modify the module's export API, **must** check all projects or files that depend on this module and make corresponding adjustments.
- **Modifying `package.json` (especially `dependencies` or `scripts`)**:
  - **Must** notify team members or relevant AI Agent to run `npm install`.
  - If you modify `scripts`, ensure CI/CD processes (if any) are also updated accordingly.
- **Modifying `.env.example`**:
  - **Must** synchronize updates to all development environment `.env` files and notify team members.
- **Modifying `README.md` or documents in `docs/`**:
  - If the change involves core features or usage, **must** ensure the accuracy and timeliness of the documentation.

## 8. AI Decision Standards

### 8.1. Handling Ambiguous Requests

- When receiving ambiguous development instructions (e.g., "optimize task list display"):
  1.  **Try to clarify**: If possible, request more specific details or expected results from the user or task initiator.
  2.  **Analyze context**: Check related code (`src/`), existing UI (if any), and related issues (if any) to infer possible intent.
  3.  **Propose solutions**: Based on analysis, propose 1-2 specific implementation solutions and explain their pros and cons and estimated work.
  4.  **Wait for confirmation**: Do not perform large-scale code modifications until a clear direction is obtained.

### 8.2. Error/Exception Handling Strategy

- **Priority**:
  1.  **User Experience**: Avoid program crashes, provide friendly error prompts.
  2.  **Data Integrity**: Ensure errors do not lead to data damage or inconsistency.
  3.  **System Stability**: Record detailed error information for troubleshooting.
- **Choice**:
  - For predictable errors (e.g., invalid user input), handle them within the context of the operation and give prompts.
  - For unexpected system errors, capture, record, and possibly throw or trigger global error handling mechanism.

### 8.3. Dependency Selection

- When a new third-party library is needed:
  1.  **Check existing**: Ensure the project already has a similar library that can meet the need.
  2.  **Evaluate options**:
      - **Activity and Community Support**: Choose libraries with good maintenance and active community.
      - **Lightweight**: Avoid introducing overly large or redundant libraries.
      - **Security**: Check for any known security vulnerabilities.
      - **License**: Ensure compatible with project license.
  3.  **Minimization Principle**: Only introduce the library that is actually needed.

## 9. Prohibited Actions

- **Do not directly modify files in the `dist/` directory.** This directory is for compiled products.
- **Do not assume new dependencies are available without executing `npm install` in an unmodified state.**
- **Do not submit untested or incomplete code to the main branch (`main` or `develop`).** Must use feature branches.
- **Do not submit code containing API Keys, passwords, or other sensitive information to version control systems.** Use `.env` files to manage this type of information.
- **Do not make large-scale changes to the core architecture or public API without prior notification or approval.**
- **Do not ignore TypeScript type errors.** Must resolve all `tsc` reported errors.
- **Do not use `any` type without sufficient reason and comments.**
- **Do not leave large amounts of `console.log` or other temporary debug code in the code.**
- **Do not release a new version without updating `CHANGELOG.md`.**
- **Do not introduce third-party libraries incompatible with the project's MIT license.**

## 10. Updating This Specification File (`shrimp-rules.md`)

- When the project's tech stack, core architecture, main workflow, or important specifications change, **must** sync this file accordingly.
- Update requests should clearly specify the sections and content needing changes.
- If a fuzzy "update rule" command is received, AI Agent **must**:
  1.  Self-analyze recent code changes (e.g., `git diff`, recent commit).
  2.  Compare existing `shrimp-rules.md` with project status to find inconsistencies or outdated rules.
  3.  List inferred update points and reasons in `process_thought` stage.
  4.  Propose specific modification suggestions or directly edit this file.
  5.  **Strictly prohibit** seeking clarification from users before self-analyzing.

---

This development guideline aims to ensure that AI Agents can efficiently, consistently, and securely participate in the development of the `mcp-shrimp-task-manager` project.
