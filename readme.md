# Express.js & PostgreSQL REST API (Task Manager)

A robust, persistent RESTful API built with **Node.js**, **Express**, **Prisma ORM**, and a cloud-hosted **PostgreSQL (Neon)** database. 

This project marks the transition from temporary in-memory storage to persistent relational database management, featuring error handling, strict input validation, and clean async control flows.

---

## 🛠️ Tech Stack & Architecture

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js v5
- **Database:** PostgreSQL (Cloud-hosted via Neon)
- **ORM:** Prisma Client & CLI v5.22.0
- **Environment Management:** dotenv
- **Development Tooling:** Nodemon

---

## 📁 Project Structure

```text
├── prisma/
│   └── schema.prisma    # Database schema & model definitions
├── .env                 # Database connection strings & environment variables
├── db.js                # Instantiated Prisma Client export
├── server.js            # Express app & route definitions
├── package.json         # Project dependencies & scripts
└── README.md            # Project documentation
```

---

## 🗄️ Database Schema

Defined in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- A PostgreSQL connection string (e.g., from Neon)

### 2. Installation
Clone the repository and install the dependencies:

```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
```

### 4. Database Sync & Client Generation
Sync your schema with your database and generate the local Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

### 5. Running the Application

**Development Mode (auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server runs on **`http://localhost:3030`** by default.

---

## 📡 API Endpoints

### **Tasks Resource** (`/api/tasks`)

| Method | Endpoint        | Description           | Request Body (JSON)              | Success Status |
| :----- | :-------------- | :-------------------- | :------------------------------- | :------------- |
| `GET`  | `/api/tasks`    | Get all tasks         | *None*                           | `200 OK`       |
| `GET`  | `/api/tasks/:id`| Get a task by ID      | *None*                           | `200 OK`       |
| `POST` | `/api/tasks`    | Create a new task     | `{ "title": "String" }`          | `201 Created`  |
| `PUT`  | `/api/tasks/:id`| Update an existing task| `{ "title": "String", "completed": Boolean }` | `200 OK` |
| `DELETE`| `/api/tasks/:id`| Delete a task by ID   | *None*                           | `200 OK`       |

---

## 🛡️ Input Validation & Guard Rails

- **400 Bad Request:** Triggered when creating or updating a task with an empty or whitespace-only `title`.
- **404 Not Found:** Returned when trying to fetch, update, or delete a task ID that does not exist in PostgreSQL.
- **500 Internal Server Error:** Standardized fallback handling for database connectivity issues or uncaught server errors.

---

## 💡 Key Learnings & Milestones

1. **REST API Design:** Implemented standardized HTTP methods, resource pathing, and appropriate HTTP status codes.
2. **Database Persistence:** Replaced in-memory Javascript arrays with async relational database transactions.
3. **ORM Operations:** Mastered basic Prisma Client methods (`findMany`, `findUnique`, `create`, `update`, `delete`).
4. **Environment Isolation:** Configured `.env` variables to prevent sensitive database credentials from leaking into codebase repositories.