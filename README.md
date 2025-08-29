# TaskApp Backend

This is a simple backend service built with **Azure Functions** and **Azure Cosmos DB**.  
It provides CRUD operations for managing tasks, designed with repository layering, utilities for error and HTTP handling, and constants for messages.

---

## 🚀 Features

- **Layered repository structure** for maintainability and readability
- **Cosmos DB integration** using SDK
- **CRUD operations** on tasks
- **Bulk delete** operation via POST
- **Utility layer** for error handling and HTTP handler abstraction
- **Constants** for reusable messages

---

## 📂 Project Structure

```
src/
├── functions/        # Azure Function endpoints (HTTP triggers)
├── repositories/     # Data access layer (Cosmos DB operations)
├── utils/            # Shared utilities (error handler, http handler, etc.)
├── lib/              # Database connection (CosmosClient)
├── constants/        # Constants for messages and status
├── types/            # Type definitions
└── config/           # Config for DB
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x)
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- [Azure Cosmos DB Emulator](https://learn.microsoft.com/azure/cosmos-db/local-emulator) (for local development)

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `local.settings.json` file in the root directory:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_CONNECTION_STRING": "",
    "TENANT_ID": "your-tenant-id",
    "TASK_DB": "TaskApp",
    "TASK_CONTAINER": "Tasks",
    "NODE_TLS_REJECT_UNAUTHORIZED": "0"
  }
}
```

> **Note**: The key above is the default key for Cosmos DB Emulator. Update with your actual Cosmos DB credentials.

### Start the Development Server

```bash
npm start
```

The functions will be available at `http://localhost:7071/api/`

---

## 📡 API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/task/{id}` | Get task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/task/{id}` | Update task by ID |
| `DELETE` | `/api/task/{id}` | Delete task by ID |
| `POST` | `/api/tasks/bulk-delete` | Bulk delete tasks |

### Repository Pattern
The application follows a repository pattern for data access abstraction:

- **Functions Layer**: HTTP triggers that handle requests/responses
- **Repository Layer**: Data access operations with Cosmos DB
- **Utils Layer**: Shared utilities for error handling and HTTP responses
- **Constants Layer**: Centralized messages
