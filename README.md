# Taskpro Task Management System 🚀
A modern, high-performance, and fully responsive full-stack task management application. Designed with a futuristic **Mobile-first Glassmorphism UI**, this system ensures seamless team collaboration, role-based access control, and real-time synchronization between Administrators and Employees.
![Task Management](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![React](https://img.shields.io/badge/Frontend-React_19_(Vite)-blue)
![Nodejs](https://img.shields.io/badge/Backend-Node.js_&_Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-orange)
---
## 🌟 Key Features
### 🔐 Secure Authentication & Role Management
*   **JWT & BcryptJS:** Encrypted passwords and secure, stateless token-based authentication.
*   **Role-Based Access Control (RBAC):** Distinct routing and operational logic for `Admin` and `Employee` accounts.
### 👑 Admin Command Center (Dashboard)
*   **Total Oversight:** Live statistical counters for total protocols, processing tasks, executed tasks, and active agents.
*   **Task Initialization (CRUD):** Create, read, update, and delete tasks. Assign critical operations directly to specific employees.
*   **Real-time Tracking:** Watch tasks progress autonomously without manual page reloads.
### 👷 Employee Kanban Workflow
*   **Distraction-Free Execution:** A dedicated Kanban board divided into **Assigned (Pending)**, **Processing (In Progress)**, and **Executed (Completed)**.
*   **Status Transitions:** Intuitive interface to promote tasks across execution phases with secure confirmation checks to prevent accidental "Completed" triggers.
### ⚡ Real-Time Synchronization
*   Powered by **Socket.io**. As employees update their task statuses, the Admin dashboard and other relevant clients automatically sync state instantly.
### 🎨 Premium "Futuristic" UI/UX
*   **Dynamic Theme Engine:** High-contrast **Dark Mode** with neon accents and an ultra-clean **Light Mode** (Creamish White).
*   **Micro-animations & Glassmorphism:** CSS cubic-bezier transitions, floating glass panels, and sub-second layout reflows ensure a premium feel.
*   **100% Mobile Responsive:** Complex data tables and Kanban grids collapse elegantly onto smartphone displays.
---
## 🛠️ Technology Stack
| Architecture | Technologies | Functionality |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7 | Lightning-fast SPAs, glassmorphism styling, client-side routing. |
| **Backend** | Node.js, Express.js 5 | Robust RESTful API architecture. |
| **Database** | MongoDB (Cloud Atlas), Mongoose 9 | Resilient NoSQL document storage and ODM. |
| **Real-time** | Socket.io, Socket.io-client | WebSockets for instant state-sync across connected clients. |
---
## 🚀 Local Installation & Setup Guide
### Prerequisites
*   [Node.js](https://nodejs.org/) (v16.x or higher)
*   [MongoDB](https://www.mongodb.com/) (Local instance or Cloud Atlas cluster)
*   Git
### 1. Clone the Repository
```bash
git clone https://github.com/codeverse07/Taskpro-task-management-System-.git
cd Taskpro-task-management-System-
```
### 2. Backend Environment Configuration
Navigate to the `backend` folder and configure the environment variables:
```bash
cd backend
npm install
```
Create a `.env` file in the root of the `/backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```
### 3. Frontend Environment Configuration
Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```
### 4. Booting the Application
The application requires **both** the backend and frontend servers to run concurrently in two separate terminal windows.
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The application will now be live effectively at: `http://localhost:5173`
---
## 🧪 Evaluation Access (Test Credentials)
If you wish to demo the platform without creating new accounts, utilize the pre-seeded evaluation credentials:
*   **Admin Access:**
    *   **Email:** `admin@eval.com`
    *   **Password:** `TestCompany123!`
*   **Employee Access:**
    *   **Email:** `employee@eval.com`
    *   **Password:** `TestCompany123!`
---
## 📂 Project Structure
```text
Taskpro-task-management-System-/
├── backend/                  # Node.js/Express API
│   ├── models/               # Mongoose schemas (User, Task)
│   ├── routes/               # API endpoints
│   ├── middleware/           # JWT auth protection logic
│   ├── server.js             # API entry point
│   └── socket.js             # WebSocket configuration
├── frontend/                 # React/Vite Client
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Modals, TaskTable)
│   │   ├── context/          # Global AuthContext provider
│   │   ├── pages/            # AdminDashboard, EmployeeDashboard, Auth
│   │   ├── utils/            # Axios API configurations
│   │   ├── index.css         # Tailwind & custom keyframes
│   │   └── main.jsx          # React entry point
├── docs/                     # Project PDFs (Documentation & Credentials)
└── README.md                 # You are here!
```
---
*Built with precision and high-contrast design principles.*
