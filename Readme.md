# 💼 Expense Tracker  
A modern, full-stack financial management system engineered to provide seamless expense tracking, analytics, and secure access — packaged with corporate-grade UX, modular scalability, and robust backend architecture.

---

## 📊 Overview  
Expense Tracker is a production-ready application designed for users to record, manage, and analyze their expenses with ease. With a React-powered interface and a Node.js + Express backend integrated with MongoDB, the platform ensures secure authentication, optimized data flows, and highly organized financial insights.

---

## ✨ Key Features  

### 🎯 Frontend (React + Vite + Redux Toolkit)
#### Corporate UI & UX
- Clean and professional interface aligned with modern industry standards  
- Category-first design for efficient expense organization   
- Modular architecture using reusable components

#### Expense Management  
- Create, edit, delete, and view expenses  
- Category-based filtering  
- Aggregation-powered analytics (daily totals, category breakdowns, etc.)

#### Authentication
- Login & Signup pages  
- Protected routes with token validation  
- Auto-redirect for authenticated/unauthenticated sessions

---

### 🔧 Backend (Node.js + Express + MongoDB)
#### REST API Architecture
- Clean separation across controllers, services, routes, and models  
- Optimized aggregation pipelines for analytics & reporting features  

#### Security  
- JWT with Access + Refresh Tokens  
- Protected route middleware  
- Secure cookie handling (optional)  
- Environment-based configuration system  

#### Data Handling  
- Mongoose models for User, Category, and Expense  
- Full CRUD capabilities  
- Built-in analytics endpoints through MongoDB pipelines  

---

## 🛠 Tech Stack

| Layer        | Technology             | Purpose |
|--------------|------------------------|---------|
| Frontend     | React + Vite           | Corporate-grade, component-based UI |
| State Mgmt   | Redux Toolkit          | Predictable global state container |
| Styling      | CSS3                   | UI styling and layout |
| Backend      | Node.js + Express      | API server and routing |
| Database     | MongoDB + Mongoose     | Persistent data layer |
| Auth         | JWT (Access + Refresh) | Secure authentication flow |
| Runtime      | JavaScript (ES6+)      | Full-stack ecosystem |

---

# 🚀 Quick Start

## 📦 Prerequisites  
- Node.js (v16+)  
- MongoDB (local or hosted)  
- npm or yarn  

---

# 🔧 Installation & Setup

## 1️⃣ Backend Setup  

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .dummy-env .env

# Update .env with your MongoDB credentials and JWT secrets

# Start development server
npm run dev
```

## 2️⃣ Frontend Setup  

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .dummy-env .env

# Update VITE_BACKEND_URL if required

# Start React application
npm run dev
```

## Backend URL:
```bash
http://localhost:7000/
```

## Frontend URL:
```bash
http://localhost:5000/
```

## 🔐 Frontend Environment Configuration:
### Frontend .env (Example)
```bash
VITE_API_BASE_URL="http://localhost:7000"
```

## 🔐 Backend Environment Configuration:
### Backend .env (Example)
```bash
MONGODB_URI=mongodb://localhost:27017/expense-tracker
PORT=5000
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
```

## 📁 Project Architecture
```bash
EXPENSETRACKER/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ExpenseFormOverlay/
│   │   │   ├── Header/
│   │   │   ├── ...
│   │   ├── Guards/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Expense/
│   │   │   ├── Login/
│   │   │   └── Signup/
│   │   │   └── ...
│   │   ├── utils/
│   │   ├── services/
│   │   │   ├── AuthService.js/
│   │   │   ├── CategoryService.js/
│   │   │   ├── ExpenseService.js/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .dummy-env
│   └── package.json
│
└── README.md

```

---

### 🧪 Quality & Coding Standards
- Modular architecture (Controllers → Services → Routes)

- Reusable React components

- Centralized Redux state with well-organized slices

- ESLint configuration for code consistency

- Comprehensive error handling system

### 🚀 Future Enhancements
- Dashboard charts & visual analytics

- CSV/PDF export

- Budget planning & alerts

- Multi-currency support

- Advanced reporting panels

---

## 💬 Closing Note

The Expense Tracker is engineered with scalability, security, and maintainability at its core — making it a robust foundation for personal finance applications and enterprise-level expansions alike.