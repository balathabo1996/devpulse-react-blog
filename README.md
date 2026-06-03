<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <br />
  <br />
  <h1>✨ DevPulse Blog</h1>
  <p><strong>A Premium, Full-Stack Real-Time Blogging Platform</strong></p>
</div>

<hr />

## 📖 Overview

DevPulse is a state-of-the-art blogging platform designed to deliver a modern, deeply immersive reading and authoring experience. Featuring a stunning glassmorphism UI, a robust real-time comment engine, and a comprehensive backend architecture, DevPulse provides a seamless environment for developers, writers, and tech enthusiasts to share knowledge.

The application leverages **React** on the frontend for lightning-fast navigation, tightly coupled with a powerful **Node.js/Express** backend supported by **MongoDB**. All user authentication and identity management is securely handled via **Firebase**.

## 🚀 Key Features

### 🎨 Premium User Interface
- **Dynamic Glassmorphism Design:** Beautiful translucent panels, smooth interactive hover states, and meticulously curated typography built entirely with pure CSS.
- **Fluid Animations:** Seamless micro-interactions during page transitions, dropdown menus, and authentication forms.
- **Syntax Highlighting:** Integrated **Prism.js** automatically detects code blocks within articles and beautifully highlights them in a sleek dark IDE theme.
- **SEO Optimized:** Dynamically generated Open Graph (OG) and Twitter Card meta tags via `react-helmet-async` ensure beautiful social media preview cards when articles are shared.

### ⚡ Performance Architecture
- **Infinite Scroll & Pagination:** Automatically fetches older posts as the user scrolls, drastically reducing initial payload sizes.
- **Skeleton Loaders:** Elegant, pulsing placeholder UI renders instantly while data is seamlessly fetched in the background.

### 🔐 Advanced Authentication & User Community
- **Secure Architecture:** Powered by Firebase Authentication to deliver enterprise-grade security.
- **Multiple Login Methods:** Support for frictionless 1-click **Google OAuth** as well as native **Email & Password** registration.
- **User Profile Dashboard:** A dedicated space where readers can view their comment history, easily jump to their "Liked" posts, and seamlessly manage their Display Name.

### 🌐 Real-Time Ecosystem
- **Live Active Readers:** An elegant, pulsing green badge powered by Socket.io "Rooms" instantly displays exactly how many people are currently reading the same article.
- **Live Comments:** Users can see new comments appear in real-time as they are posted without ever refreshing the page.
- **Like System:** A dynamic, instant-feedback post liking mechanism to engage readers.
- **Rich Text Authoring:** An integrated Markdown/Rich-Text editor (via React Quill) allows authors to perfectly format their posts with code blocks, lists, and images.

### 🛡️ Admin Management System
- **Secure Admin Portal:** A dedicated control center guarded by the Firebase Admin SDK.
- **Full Control:** The admin can seamlessly draft, publish, and format new articles.
- **User Moderation:** A dedicated User Management dashboard allows the admin to view all registered users and permanently delete unverified or malicious accounts with built-in pagination.

---

## 🏗️ Technical Stack

**Frontend Architecture:**
* **Framework:** React 19 (Bootstrapped with Vite)
* **Routing:** React Router DOM v6
* **Styling:** Highly modular Vanilla CSS3 with CSS Variables for extreme customization
* **SEO:** React Helmet Async
* **Code Formatting:** Prism.js
* **Icons:** Lucide React
* **Editor:** React Quill

**Backend Architecture:**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (with Mongoose ODM)
* **Real-time Engine:** Socket.io
* **Identity:** Firebase Admin SDK

---

## 🛠️ Installation & Setup

To run DevPulse locally on your machine, you'll need to set up both the frontend client and the backend server.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/devpulse-react-blog.git
cd devpulse-react-blog
```

### 2. Configure the Backend (Server)
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGODB_URI="your_mongodb_connection_string"

# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_CLIENT_EMAIL="your_service_account_email"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Nodemailer Settings (Optional for emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
ADMIN_EMAIL="admin@yourdomain.com"
```
Start the backend server:
```bash
npm run dev
```

### 3. Configure the Frontend (Client)
Open a new terminal window, return to the project root, and install dependencies:
```bash
npm install
```
Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_API_URL="http://localhost:5000"
VITE_ADMIN_EMAIL="admin@yourdomain.com"
```
Start the frontend development server:
```bash
npm run dev
```

The application will now be running on `http://localhost:5173`.

---

## 🔒 Security

DevPulse strictly adheres to modern security practices:
- **No stored passwords:** All credentials and passwords are strictly managed and salted by Google's Firebase infrastructure.
- **JWT Verification:** All protected backend routes enforce stringent JWT verification.
- **XSS Protection:** User-generated HTML is systematically scrubbed with `DOMPurify` before rendering.
- **Protected Environment Variables:** Critical secrets are strictly kept out of version control via comprehensive `.gitignore` rules.

---
<div align="center">
  <i>Designed and Built with passion.</i>
</div>
