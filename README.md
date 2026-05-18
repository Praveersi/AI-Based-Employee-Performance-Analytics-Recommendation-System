# ⚡ EmpAI — AI-Based Employee Performance Analytics System

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations.

## 🚀 Quick Start (VS Code)

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free tier)
- OpenRouter API key (free at openrouter.ai)

---

## 📁 Project Structure
```
employee-ai-system/
├── backend/           # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### Step 1: Set up MongoDB Atlas
1. Go to https://cloud.mongodb.com and create a free account
2. Create a new cluster (free tier M0)
3. Under **Database Access**, create a user with password
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs)
5. Click **Connect → Connect your application** and copy the connection string

### Step 2: Get OpenRouter API Key
1. Go to https://openrouter.ai and sign up (free)
2. Go to **Keys** → Create a new key
3. Copy the key (starts with `sk-or-...`)

### Step 3: Configure Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:
```
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/employeeDB?retryWrites=true&w=majority
JWT_SECRET=any_random_long_secret_string_here
OPENROUTER_API_KEY=sk-or-your-key-here
```

### Step 4: Install & Run Backend
```bash
cd backend
npm install
npm run dev        # Development (with nodemon)
# OR
npm start          # Production
```

Backend runs at: http://localhost:5000

### Step 5: Configure & Run Frontend
```bash
cd frontend
cp .env.example .env
# .env already has REACT_APP_API_URL=/api (proxy handles it in dev)
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Employees (Protected — requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/employees | Add employee |
| GET | /api/employees | Get all employees |
| GET | /api/employees/:id | Get single employee |
| GET | /api/employees/search?department=Development | Search/filter |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |

### AI (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/recommend | Get recommendation for employee |
| GET | /api/ai/rankings | Get AI team rankings |
| POST | /api/ai/bulk-feedback | Generate feedback for all employees |

---

## ☁️ Deployment on Render

### Deploy Backend
1. Push your code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables (same as your .env)
6. Deploy!

### Deploy Frontend
1. Go to https://render.com → New → Static Site
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
5. Deploy!

---

## 📝 Sample API Request Bodies

### POST /api/auth/signup
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "password123",
  "role": "admin"
}
```

### POST /api/employees
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

### POST /api/ai/recommend
```json
{
  "employeeId": "employee_id_here"
}
```

---

## 🔐 Security Features
- JWT authentication (7-day expiry)
- bcrypt password hashing (salt rounds: 10)
- Protected API routes
- Input validation with express-validator
- CORS configured

## 📦 Tech Stack
- **Frontend**: React 18, React Router v6, Axios, Recharts, React Toastify
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **AI**: OpenRouter API (Mistral 7B free model)
- **Auth**: JWT + bcrypt
