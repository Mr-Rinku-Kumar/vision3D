# 🎨 3D Object Viewer - Full Stack Application

A production-ready full-stack web application that allows users to visualize and manipulate 3D objects using Three.js, with user authentication, data persistence, and cloud deployment.

## 🚀 Live Demo

**[View Live Application](YOUR_VERCEL_URL)**

- Frontend: Deployed on Vercel
- Backend: Deployed on Render
- Database: MongoDB Atlas
- Storage: Cloudinary CDN

## 📋 Features

### ✅ Core Features
- **3D Object Visualization** - View GLB models in an interactive 3D space
- **Object Manipulation** - Rotate, zoom, and pan around models using intuitive controls
- **User Authentication** - Secure JWT-based registration and login
- **Data Persistence** - Save and restore camera states across sessions
- **Model Management** - Upload, load, and delete multiple 3D models

### 🎯 Technical Features
- Full-stack JavaScript (MERN stack)
- RESTful API architecture
- JWT token-based authentication
- MongoDB for data persistence
- Cloudinary for file storage and CDN
- Responsive design with dark/light mode
- Production-ready deployment

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Three.js / @react-three/fiber | 3D Rendering |
| @react-three/drei | 3D Helpers |
| Axios | HTTP Client |
| React Router DOM | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Cloudinary | File Storage |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Database Hosting |
| Cloudinary | CDN + Storage |

## 📁 Project Structure
project-root/
├── backend/
│ ├── controllers/
│ │ ├── authController.js
│ │ └── objectController.js
│ ├── models/
│ │ ├── User.js
│ │ └── UserObject.js
│ ├── routes/
│ │ ├── auth.js
│ │ └── objects.js
│ ├── middleware/
│ │ └── auth.js
│ ├── config/
│ │ └── cloudinary.js
│ ├── .env
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ └── Viewer.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env
│ └── vite.config.js
└── README.md

text

## 🏗️ Architecture Diagram
┌─────────────────────────────────────────────────────────────┐
│ Client Browser │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Vercel (Frontend Hosting) │
│ React + Three.js Application │
└─────────────────────────────────────────────────────────────┘
│
│ HTTPS / REST API
▼
┌─────────────────────────────────────────────────────────────┐
│ Render (Backend Hosting) │
│ Node.js + Express Server │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ JWT Auth │ │ File Upload │ │ Routes │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
│ │
▼ ▼
┌──────────────────────┐ ┌─────────────────────────────┐
│ MongoDB Atlas │ │ Cloudinary │
│ (Database) │ │ (File Storage + CDN) │
│ │ │ │
│ • Users │ │ • GLB Model Files │
│ • Objects │ │ • Automatic Optimization │
│ • Camera States │ │ • Global CDN Delivery │
└──────────────────────┘ └─────────────────────────────┘

text

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/3d-viewer
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Frontend (.env)
env
VITE_API_URL=http://localhost:5000/api
Local Development
Clone the repository

bash
git clone https://github.com/yourusername/3d-object-viewer.git
cd 3d-object-viewer
Install Backend Dependencies

bash
cd backend
npm install
npm run dev
Install Frontend Dependencies

bash
cd frontend
npm install
npm run dev
Open Application

text
http://localhost:5173
🚀 Deployment Guide
Backend Deployment (Render)
Push code to GitHub

Create new Web Service on Render

Connect GitHub repository

Add environment variables

Deploy

Frontend Deployment (Vercel)
Push code to GitHub

Import project on Vercel

Configure environment variables

Deploy

📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
Objects
Method	Endpoint	Description
POST	/api/objects/upload	Upload GLB file
GET	/api/objects/my-objects	Get user's objects
PUT	/api/objects/:id/camera-state	Save camera state
DELETE	/api/objects/:id	Delete object
🎮 Usage Guide
1. Create Account
Navigate to the application

Click "Register" and enter email/password

Automatically logged in after registration

2. Upload 3D Model
Click "Upload .glb File" button

Select a GLB file from your computer

Wait for upload to complete

3. Interact with Model
Rotate: Left-click + drag

Pan: Right-click + drag

Zoom: Scroll wheel

4. Save Camera State
Position camera at desired angle

Click "Save Camera State"

State persists across sessions

5. Manage Models
View all uploaded models in sidebar

Click "Load" to switch models

Click "Delete" to remove models

⚡ Performance Optimizations
Implemented
Lazy Loading - Three.js models loaded on demand

Code Splitting - React components lazy loaded

CDN Acceleration - Cloudinary for model delivery

MongoDB Indexing - Optimized database queries

JWT Token Caching - Reduced authentication overhead

Monitoring
Render provides automatic health checks

MongoDB Atlas provides performance metrics

Cloudinary provides CDN analytics

🔒 Security Features
JWT tokens with expiration

Password hashing with bcrypt

Protected API routes

CORS configuration

File validation (type & size)

Environment variables for secrets

📊 Database Schema
User Collection
javascript
{
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
UserObject Collection
javascript
{
  userId: ObjectId (ref: User),
  fileName: String,
  fileUrl: String,
  cloudinaryPublicId: String,
  cameraState: {
    position: { x, y, z },
    target: { x, y, z }
  },
  createdAt: Date
}
🐛 Troubleshooting
Common Issues
Issue	Solution
MongoDB connection error	Check IP whitelist in Atlas
Upload fails	Verify Cloudinary credentials
Auth not working	Check JWT_SECRET in .env
CORS error	Ensure backend URL in frontend .env
📝 License
This project is created for the Developer Assignment submission.

👨‍💻 Author
[Your Name]

GitHub: yourusername

Email: your.email@example.com

🙏 Acknowledgments
Three.js community

React Three Fiber team

Cloudinary for file hosting

MongoDB Atlas for database

Live URL: https://your-app.vercel.app
GitHub: https://github.com/yourusername/3d-object-viewer