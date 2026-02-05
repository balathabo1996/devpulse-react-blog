# DevPulse — The Future of Tech. Today.

<div align="center">
  <img src="public/logo.svg" alt="DevPulse Logo" width="80" height="80" />
  <p><i>A modern, high-performance tech blog built with React, TypeScript, and Vite.</i></p>
</div>

---

## 🚀 Overview

**DevPulse** is a sleek, developer-focused blogging platform designed with a neon-inspired dark mode aesthetic and glassmorphism UI. It demonstrates modern frontend patterns including typed props, component composition, form validation, and persistent state management.

## ✨ Features

- **Dynamic Content System**: Browse articles by category (Engineering, AI, Career) or view all recent posts.
- **Persistent Navigation**: Your current view, selected post, and active filters are saved automatically. Refresh the page without losing your place.
- **Interactive Comments**:
  - Live form validation (min 2 chars for name, 10 words for comment).
  - Instant updates: Comments appear immediately without page reload.
  - "Lively" UI: Smooth animations and visual error feedback.
- **Rich Post Details**: Full-width hero images, like buttons, and related metadata.
- **Contact Form**: Functional inquiry form with strict validation and inline success messaging.
- **Responsive Design**: Fully optimized layout for mobile, tablet, and desktop screens.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Native CSS3 (Variables, Flexbox/Grid, Animations)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/devpulse.git
    cd devpulse
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (Navbar, Hero, PostCard...)
├── data/            # Static mock data (posts.ts)
├── types/           # TypeScript interfaces (Post, Comment)
├── App.tsx          # Main application logic & state management
├── main.tsx         # Entry point
└── index.css        # Global styles & CSS variables
```

## 🎨 Design System

The UI follows a consistent "Dark Slate" theme defined in `index.css`:

- **Primary**: Pink/Purple Gradient (`--primary-gradient`)
- **Background**: Deep Slate (`#0f172a`)
- **Typography**: Inter / Outfit sans-serif fonts
