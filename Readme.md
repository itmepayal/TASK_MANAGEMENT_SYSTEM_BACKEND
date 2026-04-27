# 📈 Task Management System API

📄 **Swagger Docs:**  
https://stock-management-system-qgvh.onrender.com/docs

🚀 **Live API:**  
https://stock-management-system-qgvh.onrender.com

🚀 **Postman Collection Video:**  
https://www.loom.com/share/f738e2434fac4c5d896232c3225930e0

---

## 📌 Overview

A **A scalable and production-grade Task Management REST API** designed to streamline task organization, improve productivity, and support high-performance applications.

This API provides powerful features such as:

- Full task lifecycle management (CRUD operations)
- Pagination, filtering support
- Modular architecture (Controller → Service → Model)
- Robust error handling with custom exceptions

---

## 🚀 Features

- ✅ Task creation, update, and deletion
- 🔁 Task status management (Pending ↔ Completed)
- 📄 Server-side pagination for scalable data handling
- 🔍 Filtering tasks (completed, pending)
- ⚡ Optimized performance with efficient queries
- 🧩 Modular and scalable architecture
- 💼 Portfolio Management
- 🛡️ Centralized error handling

---

## 🏗️ Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Backend  | NODE JS    |
| Database | MONGODB    |
| Frontend | REACT JS   |

---

## 📁 Project Structure

src/
│── app/
│── config/
│── middleware/
│── models/
│── modules/
│── routes/
│── utils/
│
└── server.ts

---

## 🧩 Database Models

### 👤 Tasks

- text
- completed
- priority
- dueDate
- tags
- createdAt
- updatedAt

---

## 🔑 Tasks APIs

| Method | Endpoint                | Description   |
| ------ | ----------------------- | ------------- |
| POST   | `/api/tasks`            | Create Tasks  |
| GET    | `/api/tasks`            | Get all Tasks |
| PATCH  | `/api/tasks/:id`        | Update Tasks  |
| PATCH  | `/api/tasks/:id/toggle` | Toggle Tasks  |
| DELETE | `/api/tasks`            | Delete Tasks  |

---

## 📦 Standard API Response

All responses follow this structure:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

## ⚙️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/itmepayal/TASK_MANAGEMENT_SYSTEM_BACKEND.git
cd TASK_MANAGEMENT_SYSTEM_BACKEND
```

### 2. Install NPM Package

```bash
npm i
```

## ▶️ Run Locally

```bash
http://localhost:8000
```

Swagger
http://localhost:8000/api/docs

## 🔐 Environment Variables

| Variable  | Value                                            |
| --------- | ------------------------------------------------ |
| PORT      | 8000                                             |
| NODE_ENV  | development                                      |
| MONGO_URI | MONGO_URI=mongodb://127.0.0.1:27017/task-manager |

## 👨‍💻 Author

Payal Yadav
