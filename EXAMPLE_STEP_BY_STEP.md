# Step-by-Step Example: Using MCP Shrimp Task Manager

## Project Context: SEO Article Management Microservice

**Tech Stack Requirements:**
- **Language & Build:** Go 1.23
- **Web Framework:** Gin (github.com/gin-gonic/gin v2.x)
- **Dependency Injection:** google/wire (v0.6.0)
- **Logging:** Zap (go.uber.org/zap v1.27+)
- **API Gateway / Ingress:** Traefik (traefik:v3.4 Docker image)
- **Authentication/Authorization:** Casdoor (github.com/casdoor/casdoor-go-sdk v1.5.0)
- **Database:** MongoDB (go.mongodb.org/mongo-driver v2.1.0)
- **Cache/Session:** Redis 8 (github.com/redis/go-redis/v9 v9.8.0)
- **Task Queue:** Asynq (github.com/hibiken/asynq v0.29.0 + Asynqmon UI)
- **Message Bus:** Kafka (github.com/segmentio/kafka-go v0.4.47)
- **Config:** Viper (github.com/spf13/viper v2)
- **Validation:** go-validator (github.com/go-playground/validator/v11)
- **OpenAPI/Swagger:** Swag (github.com/swaggo/swag v1.16.4)
- **Observability:** OpenTelemetry Go (go.opentelemetry.io/otel v1.35.0)
- **Prometheus Client:** github.com/prometheus/client_golang v1.18.0
- **Metrics Backend:** Prometheus 2.52 + Grafana 11
- **Tracing:** Grafana Tempo 2.x
- **Log Aggregation:** Grafana Loki 2.9 + Promtail
- **Resiliency:** Circuit-breaker (github.com/sony/gobreaker), Retry HTTP (github.com/hashicorp/go-retryablehttp), Rate-limit (github.com/ulule/limiter/v3)
- **Testing/QA:** testify, google/go-cmp/cmp, ginkgo/gomega, pact-go, vegeta
- **Dev & CI/CD:** air (hot-reload), golangci-lint, GitHub Actions, Docker BuildKit, docker-compose, K8s (Helm/ArgoCD)

**Required Folder Structure (following Daniel Mesquitta's Go project architecture):**

```
my-service/
├── cmd/                # entrypoint (main.go, main_test.go …)
│   └── my-service/
│       └── main.go
├── internal/           # application code – only for this module
│   ├── domain/         # core business
│   │   ├── entity/     # model structs (e.g., Article, User)
│   │   ├── errs/       # business errors (e.g., ErrArticleNotFound)
│   │   └── usecase/    # CQRS logic (e.g., CreateArticle, ListArticles)
│   ├── provider/       # external system gateways (DB, Kafka, S3 …)
│   └── ...
├── pkg/                # reusable code for other modules
├── api/                # OpenAPI/Swagger definitions
├── scripts/            # helper scripts
├── deployments/        # deployment configs (Docker, K8s, Helm)
├── test/               # integration & contract tests
├── docs/               # documentation
└── go.mod, go.sum      # Go module files
```

---

## How to Write Effective Prompts for MCP Server

To ensure the MCP Shrimp Task Manager (MCP server) generates tasks and code that **strictly follow your tech stack and folder structure**, always craft your prompts with clear, explicit instructions. Here's how:

### 1. Be Explicit in Your Prompt
- **State the tech stack**: List all required technologies, versions, and libraries.
- **Describe the folder structure**: Specify the architecture and where each type of code should go.
- **Mention conventions**: If you have naming, API, or design conventions, include them.
- **Clarify priorities**: Emphasize that all generated tasks, code, and suggestions must comply with these requirements.

### 2. Prompt Template Example

```
You are to plan and generate tasks for a new microservice called "SEO Article Management Service".

**Strict requirements:**
- Use Go 1.23 as the programming language.
- Use the following tech stack:
  - Gin (github.com/gin-gonic/gin v2.x) for the web framework
  - google/wire for dependency injection
  - Zap for logging
  - Traefik for API gateway
  - Casdoor for authentication/authorization
  - MongoDB (go.mongodb.org/mongo-driver v2.1.0) as the database
  - Redis 8 for cache/session
  - Asynq for task queue
  - Kafka for message bus
  - Viper for config
  - go-validator for validation
  - Swag for OpenAPI/Swagger
  - OpenTelemetry, Prometheus, Grafana, Tempo, Loki for observability
  - Circuit-breaker, retry, and rate-limit as specified
  - Use the listed tools for testing, CI/CD, and deployment

**Folder structure must follow Daniel Mesquitta's Go project architecture:**
```
my-service/
├── cmd/                # entrypoint (main.go, main_test.go …)
│   └── my-service/
│       └── main.go
├── internal/           # application code – only for this module
│   ├── domain/         # core business
│   │   ├── entity/     # model structs (e.g., Article, User)
│   │   ├── errs/       # business errors (e.g., ErrArticleNotFound)
│   │   └── usecase/    # CQRS logic (e.g., CreateArticle, ListArticles)
│   ├── provider/       # external system gateways (DB, Kafka, S3 …)
│   └── ...
├── pkg/                # reusable code for other modules
├── api/                # OpenAPI/Swagger definitions
├── scripts/            # helper scripts
├── deployments/        # deployment configs (Docker, K8s, Helm)
├── test/               # integration & contract tests
├── docs/               # documentation
└── go.mod, go.sum      # Go module files
```

**Instructions:**
- All planned tasks, code, and documentation must strictly adhere to the above tech stack and folder structure.
- Do not use any other frameworks, libraries, or project layouts.
- If a task involves file creation or code generation, specify the exact path according to the structure.
- If in doubt, ask for clarification before proceeding.

**First task:**  
Plan the initial set of tasks to scaffold this microservice, including setting up the folder structure, initializing Go modules, and preparing the main application entrypoint.
```

### 3. How to Use This Prompt
- Paste the prompt into your MCP-compatible client (e.g., Cursor IDE chat, Web GUI, or API).
- Adjust the "First task" section for your current goal (e.g., "Implement the Article entity and CRUD use cases").
- For each new feature or change, repeat the pattern: always restate the tech stack and folder structure at the top of your prompt for clarity and consistency.

### 4. Example: Planning a Feature

```
Plan the implementation of the "Article" entity and its CRUD operations for the SEO Article Management Service.

Requirements:
- Use Go 1.23, Gin, MongoDB, Casdoor, and the specified tech stack.
- Place the entity struct in internal/domain/entity/article.go.
- Place business errors in internal/domain/errs/.
- Place use case logic in internal/domain/usecase/article.go.
- All API handlers must be in the correct package and follow the folder structure.
- Generate OpenAPI definitions in api/.
- All code must be idiomatic Go and use dependency injection via google/wire.
- All logging must use Zap.
- All validation must use go-validator.
- All configuration must use Viper.
- All code must be covered by unit tests in test/.
```

---

## How to Update Prompts for Your Project

To ensure the MCP Shrimp Task Manager always uses your custom requirements (tech stack, folder structure, conventions), you should update the system prompts using environment variables or configuration files.

### 1. Update Prompts via Environment Variables

You can override or append to the default prompts for each function by setting environment variables in your `.env` file or in the `mcp.json` config.

#### **Override Example (Recommended for strict control)**

Add to your `.env` file in the project root:
```
MCP_PROMPT_PLAN_TASK=You are to plan and generate tasks for a new microservice called "SEO Article Management Service". Strict requirements: [insert your tech stack and folder structure as in the template above]. All planned tasks, code, and documentation must strictly adhere to the above tech stack and folder structure. Do not use any other frameworks, libraries, or project layouts. If a task involves file creation or code generation, specify the exact path according to the structure. If in doubt, ask for clarification before proceeding.
```

Or, in `.cursor/mcp.json` (for Cursor IDE):
```json
{
  "mcpServers": {
    "shrimp-task-manager": {
      "command": "node",
      "args": ["/path/to/mcp-shrimp-task-manager/dist/index.js"],
      "env": {
        "DATA_DIR": "/path/to/project/data",
        "MCP_PROMPT_PLAN_TASK": "You are to plan and generate tasks for a new microservice called 'SEO Article Management Service'. Strict requirements: [insert your tech stack and folder structure as in the template above]. All planned tasks, code, and documentation must strictly adhere to the above tech stack and folder structure. Do not use any other frameworks, libraries, or project layouts. If a task involves file creation or code generation, specify the exact path according to the structure. If in doubt, ask for clarification before proceeding."
      }
    }
  }
}
```

### 2. Append to Prompts (if you want to keep the default and add your requirements)

Add to your `.env`:
```
MCP_PROMPT_PLAN_TASK_APPEND=\n\nStrict requirements: [insert your tech stack and folder structure as in the template above]. All planned tasks, code, and documentation must strictly adhere to the above tech stack and folder structure. Do not use any other frameworks, libraries, or project layouts. If a task involves file creation or code generation, specify the exact path according to the structure. If in doubt, ask for clarification before proceeding.
```

### 3. Which Prompts to Update?

- **Task Planning:** `MCP_PROMPT_PLAN_TASK`
- **Task Analysis:** `MCP_PROMPT_ANALYZE_TASK`
- **Task Execution:** `MCP_PROMPT_EXECUTE_TASK`
- **Task Splitting:** `MCP_PROMPT_SPLIT_TASKS`
- **Reflection:** `MCP_PROMPT_REFLECT_TASK`
- (And others as needed, see the table in the README)

For most use cases, updating `MCP_PROMPT_PLAN_TASK` and `MCP_PROMPT_SPLIT_TASKS` is sufficient to enforce your standards during planning and decomposition.

### 4. Tips

- Always include your tech stack and folder structure in the prompt.
- You can use multi-line strings in `.env` by escaping newlines (`\n`) or using a single line.
- For more advanced customization, copy and modify the prompt templates in `src/prompts/templates_en/` and set `TEMPLATES_USE` to your custom directory.

### 5. Example: .env File

```
MCP_PROMPT_PLAN_TASK=You are to plan and generate tasks for a new microservice called "SEO Article Management Service".\n\nStrict requirements:\n- Use Go 1.23 as the programming language.\n- Use the following tech stack: ... [list all as above] ...\n- Folder structure must follow Daniel Mesquitta's Go project architecture: ... [paste structure] ...\n\nAll planned tasks, code, and documentation must strictly adhere to the above tech stack and folder structure. Do not use any other frameworks, libraries, or project layouts. If a task involves file creation or code generation, specify the exact path according to the structure. If in doubt, ask for clarification before proceeding.
```

---

# Step-by-Step Guide

## 1. **Project Setup**

**Step:** Clone and install dependencies  
**Input:**  
- Git repository URL  
- Node.js (v18+ recommended)  
**Output:**  
- Local project folder with dependencies installed

**Prompt:**
```bash
git clone <your-repo-url>
cd mcp-shrimp-task-manager
npm install
```

---

## 2. **Start the Task Manager**

**Step:** Run the task manager  
**Input:**  
- Terminal command  
**Output:**  
- Task manager ready for interaction

**Prompt:**
```bash
npm start
```
or for development:
```bash
npm run dev
```

---

## 3. **Initialize Project Rules (Optional but Recommended)**

**Step:** Set up project rules for consistency  
**Input:**  
- Command: "init project rules"  
**Output:**  
- Project rules initialized and stored

**Prompt (in chat or command):**
```
init project rules
```

---

## 4. **Plan Your Microservice Tasks**

**Step:** Describe your microservice and requirements  
**Input:**  
- Task description (natural language)  
**Output:**  
- Structured tasks generated

**Prompt Example:**
```
Plan a microservice for SEO article management. The service should support CRUD for articles, SEO metadata, and integrate with MongoDB, Redis, Kafka, and Casdoor for authentication. Use Go, Gin, and follow the provided tech stack and folder structure.
```

---

## 5. **Review and Refine Tasks**

**Step:** List and review generated tasks  
**Input:**  
- Command: "list tasks"  
**Output:**  
- List of tasks with details

**Prompt:**
```
list tasks
```

---

## 6. **Split or Update Tasks**

**Step:** Refine or split tasks as needed  
**Input:**  
- Task ID or description  
- New details or subtasks  
**Output:**  
- Updated task list

**Prompt Example:**
```
Split the 'Implement SEO article CRUD' task into:
1. Design MongoDB schema for articles
2. Implement Create/Read/Update/Delete endpoints
3. Integrate Casdoor authentication
4. Add SEO metadata validation
```

---

## 7. **Execute Tasks**

**Step:** Work on tasks as described  
**Input:**  
- Task details  
**Output:**  
- Code, documentation, or deliverables

**Prompt Example:**
```
execute task Design MongoDB schema for articles
```
*(You implement the code in your Go project as per the task details.)*

---

## 8. **Mark Tasks as Complete**

**Step:** Mark tasks as done  
**Input:**  
- Task ID or description  
**Output:**  
- Task status updated

**Prompt:**
```
mark task Design MongoDB schema for articles as complete
```

---

## 9. **Reflect and Optimize**

**Step:** Use reflection tools to review and improve  
**Input:**  
- Task or project context  
**Output:**  
- Suggestions or retrospectives

**Prompt:**
```
reflect on the implementation process and suggest improvements for future microservices
```

---

## 10. **Export or Document Task Progress**

**Step:** Export task list or documentation  
**Input:**  
- Export command  
**Output:**  
- Markdown, JSON, or other documentation

**Prompt:**
```
export all completed tasks and their details to a markdown file
```

---

## **Summary Table**

| Step | Action | Input | Output | Example Prompt |
|------|--------|-------|--------|---------------|
| 1 | Setup | Git URL, Node.js | Project ready | `git clone ...` |
| 2 | Start | Terminal cmd | Task manager running | `npm start` |
| 3 | Init Rules | "init project rules" | Rules initialized | `init project rules` |
| 4 | Plan | Task desc | Structured tasks | `Plan a microservice...` |
| 5 | Review | "list tasks" | Task list | `list tasks` |
| 6 | Split/Update | Task ID, details | Updated tasks | `Split the task...` |
| 7 | Execute | Task details | Code, docs | `execute task ...` |
| 8 | Complete | Task ID | Status updated | `mark task ... as complete` |
| 9 | Reflect | Context | Suggestions | `reflect on the process...` |
| 10 | Export | Export cmd | Docs, files | `export all completed tasks...` |

---

**Tip:**  
You can use these steps in any MCP-compatible client (e.g., Cursor IDE) or via the Web GUI if enabled. 