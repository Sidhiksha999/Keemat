# Keemat Production Deployment Guide

This guide provides step-by-step instructions for hosting the **Keemat Agri Marketplace** across standard cloud providers (Vercel, Render, and MongoDB Atlas).

---

## 📦 Architecture Breakdown

| Component | Recommended Host | Deployment Type |
| :--- | :--- | :--- |
| **Frontend (React + Vite)** | [Vercel](https://vercel.com) / [Netlify](https://netlify.com) | Static Web App |
| **Backend (Express + Socket.io)** | [Render](https://render.com) / [Railway](https://railway.app) | Web Service (Node.js) |
| **Database** | [MongoDB Atlas](https://mongodb.com/atlas) | Managed Cloud Database |

---

## 1. Database Setup (MongoDB Atlas)

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a free **M0 Cluster** (Region: AWS / Mumbai `ap-south-1`).
3. Under **Database Access**, create a user `keemat_admin` with a password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow from anywhere).
5. Copy your connection string:
   ```env
   MONGODB_URI=mongodb+srv://keemat_admin:<PASSWORD>@keemat.ecwgevz.mongodb.net/keemat?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment (Render / Railway)

1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) → Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following build settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
5. Under **Environment Variables**, add:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://keemat_admin:<PASSWORD>@keemat.ecwgevz.mongodb.net/keemat?retryWrites=true&w=majority
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
6. Click **Deploy Web Service** and copy your backend URL (e.g. `https://keemat-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → Click **Add New Project**.
2. Import your GitHub repository.
3. Set Framework Preset to **Vite**.
4. In `vercel.json`, update the API destination URL to point to your Render backend:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://keemat-backend.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
5. Click **Deploy**.

---

## 🧪 Post-Deployment Verification

After deploying, run the seed script once to populate initial demo listings and seed bids:
```bash
npm run seed
```
