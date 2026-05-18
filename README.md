# AI Employee Performance Analytics & Recommendation System

> An AI-powered enterprise HR intelligence platform for employee performance analytics, ranking, and AI-driven recommendations. Built with the MERN stack and integrated with OpenRouter AI (GPT-4o Mini).

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![AI](https://img.shields.io/badge/AI-GPT--4o--Mini-412991?logo=openai&logoColor=white)

---

## 📋 Features

### 🔐 Authentication System
- JWT-based signup & login
- Password hashing with bcrypt
- Protected routes & middleware
- Token stored in localStorage

### 👥 Employee Management (Full CRUD)
- Add, edit, delete employees
- Search by name
- Filter by department
- Sort by performance score / experience
- Paginated employee table

### 📊 Analytics Dashboard
- Total employees, top performers, department stats
- Bar chart – Employee rankings
- Pie chart – Department distribution
- Line chart – Skill distribution
- Recent employees list
- Department performance summary table

### 🤖 AI-Powered Recommendations
- Select any employee for AI analysis
- Promotion recommendation
- Training suggestions
- Employee ranking assessment
- Performance feedback
- Missing skill suggestions
- Beautiful formatted response cards

### 🎨 UI/UX
- Dark theme with glassmorphism
- Framer Motion animations
- Responsive design (mobile-first)
- Toast notifications
- Modal confirmations
- Skeleton loaders
- Empty states

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | OpenRouter API (GPT-4o Mini) |
| Auth | JWT + bcryptjs |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP | Axios |

---

## 📁 Folder Structure

```
/client
  /src
    /components      → Reusable UI components
    /pages           → Login, Signup, Dashboard, Employees, AIInsights
    /context         → AuthContext (Context API)
    /services        → Axios API service
    /layouts         → DashboardLayout

/server
  /config            → MongoDB connection
  /controllers       → Auth, Employee, AI controllers
  /middleware         → Auth & error middleware
  /models            → User & Employee Mongoose schemas
  /routes            → API route definitions
  index.js           → Express server entry point
```

---

## ⚙️ Environment Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd ESE
```

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/employee_ai_system?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_here
PORT=5000
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Start the server:

```bash
npm run dev
```

### 3. Client Setup

```bash
cd client
npm install
```

Start the client:

```bash
npm run dev
```

The app will run at `http://localhost:5173` with API proxy to `http://localhost:5000`.

---

## 🔌 API Documentation

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

**Signup Body:**
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "password123"
}
```

**Login Body:**
```json
{
  "email": "admin@company.com",
  "password": "password123"
}
```

### Employee Endpoints (Protected – requires Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/search?department=Dev&name=john` | Search/filter employees |
| POST | `/api/employees` | Add new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

**Add Employee Body:**
```json
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

### AI Endpoint (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/recommend` | Generate AI recommendation |

**Request Body:**
```json
{
  "employeeId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

---

## 🚀 Render Deployment Guide

### Backend Deployment

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. Add Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENROUTER_API_KEY`
   - `PORT` = `5000`

### Frontend Deployment

1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `client/dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com`
5. Add a **Rewrite Rule:**
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

---

## ✅ Test Cases

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Insert valid employee | Employee stored successfully |
| 2 | Duplicate email | Error: "Employee with this email already exists" |
| 3 | Missing performance score | Validation error |
| 4 | Search by department | Filtered employee list |
| 5 | Valid login | JWT token returned |
| 6 | Invalid password | "Invalid credentials" error |
| 7 | Access protected route without token | "Not authorized, no token" |
| 8 | Check password in DB | Stored in bcrypt hash format |

---

## 👨‍💻 Author

B.Tech AI Driven Full Stack Development — End Semester Project

---

## 📄 License

This project is for educational purposes only.
