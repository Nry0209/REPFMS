# REPFMS

**REPFMS** (Research Expert Pooling and Management System) is a full-stack application designed to facilitate ,expert(supervisor) pooling, research funding requests, supervision, and administration. It consists of a Node.js/Express backend with MongoDB and a React frontend using Tailwind CSS and Redux.

---
## 🗂️ Project Structure

- `backend/`
  - Node.js application with Express
  - MongoDB models, controllers, routes, and middleware
  - File uploads managed under `uploads/`
- `frontend/`
  - React application created with Vite
  - Tailwind CSS for styling
  - Redux for state management
  - API wrappers in `src/api/`
  - Pages and components under `src/`

---
## 🚀 Getting Started
Follow these steps to run the project locally.

### Prerequisites
- Node.js (>=16)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# configure environment variables (see .env.example)
npm run dev   # starts server with nodemon
```

Environment variables may include:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/repfms
JWT_SECRET=your_jwt_secret
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev    # starts Vite dev server
```

The frontend proxies API requests to the backend via `setupProxy.js`.

---
## 🧩 Features
- Authentication for admins, researchers, and supervisors
- Research project submission and review workflows
- Funding request creation and approval
- Supervisor allocations and supervision tracking
- File uploads for CVs, transcripts, and project documents
- Notification system and feedback messaging

---
## 🛠 Technology Stack
| Layer | Technologies |
|-------|--------------|
| Backend | Node.js, Express, MongoDB, Mongoose |
| Frontend | React, Vite, Tailwind CSS, Redux Toolkit |
| Tools | Axios, Multer, JSON Web Tokens |

---
## 📂 Important Directories
- `backend/src/controllers` – request handlers
- `backend/src/models` – Mongoose schemas
- `backend/src/routes` – Express routes
- `backend/uploads` – saved user files
- `frontend/src/components` – React components
- `frontend/src/pages` – top-level page components
- `frontend/src/redux` – slices and store configuration

---
## ✅ Running Tests
Frontend tests (Jest) are located in `frontend/src/*.test.js`.
```bash
cd frontend
npm test
```

(Extend with backend test commands if added later.)

---
## 🔧 Deployment
1. Build frontend: `cd frontend && npm run build`
2. Serve `frontend/dist` statically or deploy to Netlify/Vercel.
3. Host backend on Heroku, DigitalOcean, etc., ensuring correct environment vars.
4. Configure CORS or proxy settings as needed.



---
*This README was generated with assistance from GitHub Copilot.*
