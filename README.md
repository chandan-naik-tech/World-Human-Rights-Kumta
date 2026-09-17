# WORLD HUMAN RIGHTS (WHR RK FOUNDATIONS KUMTA, U.K.)

This is the official, production-ready, full-stack website for the **World Human Rights and Social Service Organization (WHR RK Foundations Kumta, Uttara Kannada)**. 

Featuring a premium NGO layout with blue, white, gold, and dark navy color palettes, interactive timelines, video players, a photo gallery with lightboxes, active contacts inbox, and a secure admin content management system (CMS) dashboard.

---

## Technical Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Framer Motion, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **Security**: JWT Authentication, bcrypt password hashing, CORS, Helmet headers protection, API rate limiting.
- **File Uploads**: Multer local disk engine.

---

## Folder Structure
```
WHR/
├── backend/
│   ├── config/          # DB connection configuration
│   ├── controllers/     # API request handler functions
│   ├── middleware/      # Auth (JWT) & file upload (Multer) middleware
│   ├── models/          # Mongoose Schemas (Admin, Leader, Member, News, etc.)
│   ├── routes/          # Express API route bindings
│   ├── uploads/         # Static photo and video files storage
│   ├── utils/           # Database seeder utility
│   ├── .env             # Server secrets and port settings
│   ├── package.json
│   └── server.js        # Backend main server entrypoint
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Layout elements (Navbar, Footer, Loaders, WhatsApp)
│   │   ├── context/     # Dark mode (Theme) and Auth Context (JWT)
│   │   ├── pages/       # React page layouts (Home, About, Members, Admin, etc.)
│   │   ├── App.jsx      # Navigation routers mapping
│   │   ├── index.css    # Custom glassmorphic utilities and animations
│   │   └── main.jsx     # Root React initialization
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js   # Dev servers and CORS API proxies
│   └── package.json
│
└── README.md
```

---

## Installation & Setup Guide

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB service running locally (`mongodb://localhost:27017`) or a remote MongoDB Atlas connection string.

### 1. Setup Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. A default `.env` file has been created. If needed, customize `MONGO_URI` or `ADMIN_PASSWORD` in `backend/.env`.

### 2. Seed Database
Run the seeder script to initialize the default Admin account, 11 Governing Council leaders, exactly 18 member profiles, initial gallery items, videos, news, and timeline activities:
```bash
npm run seed
```
*Note: The default credentials created are:*
- **Username**: `admin`
- **Password**: `admin12345`

### 3. Start Backend Server
Run the local backend API server:
```bash
npm run dev
```
The backend starts on `http://localhost:5000`.

### 4. Setup Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
The frontend website loads on `http://localhost:5173`.

---

## Key Features

1. **Governing Council & Leaders**: Search and click dynamic leader profile cards to view comprehensive contact details, descriptions, and social media links.
2. **18 Member Profiles**: Displays exactly 18 core volunteer cards with村/village filters.
3. **Lightbox Gallery**: Categorized photo grid with a responsive lightbox viewer (All, Meetings, Social Service, Awareness Programs, Blood Donation, Events, Awards).
4. **Direct Video Modals**: Supports viewing YouTube URLs and uploaded MP4 videos locally in an overlay popup player.
5. **Grievance Contact**: Public contact forms submit messages directly to the admin dashboard database collection.
6. **WhatsApp floating button**: Reaches the configured numerical phone instantly.
7. **Admin Dashboard (Protected)**:
   - Perform CRUD updates on leaders, members, activities, and news.
   - Upload gallery images and MP4 files directly.
   - Change website history, objectives, vision/mission, addresses, and banner slides dynamically in Website Settings.
   - Monitor and manage received inquiries (mark read/replied, delete).
