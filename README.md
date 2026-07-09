<div align="center">
  
  # 🏥 Wasfa Diagnostic Centre
  ### Secure Patient Portal & Healthcare Dashboard
  
  A modern, highly secure, and beautifully designed patient portal built to provide seamless access to diagnostic reports, medical records, and billing history.

  ### [🚀 View Live Website (wasfadiagnostic.app)](https://wasfadiagnostic.app)

  <br />

  ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
  ![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)

</div>

---

## ✨ Overview

The Wasfa Diagnostic Centre platform is engineered from the ground up to modernize digital healthcare infrastructure. It prioritizes strict data security and compliance while delivering a premium, glassmorphism-inspired user interface. Patients can securely log in using their Medical Record Number (MRN) and access their health data instantly across any device.

## 🚀 Key Features

- **Enterprise-Grade Security:** Robust authentication backed by Supabase, featuring strict HTTP-only cookies, middleware route protection, and cross-tab inactivity timeouts.
- **Premium UI/UX:** A stunning, fully responsive frontend utilizing custom CSS modules, smooth micro-animations, and dynamic glassmorphism panels.
- **Bilingual Support:** Seamlessly integrates localized Urdu typography alongside English for a diverse demographic.
- **Mobile-First Engineering:** Custom programmatic scroll mitigations ensure the virtual keyboard never obscures critical inputs on mobile devices.
- **Performance Optimized:** Leverages Next.js App Router and Server Actions for lightning-fast SSR (Server-Side Rendering) and data fetching.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Vanilla CSS Modules (Strict adherence to modular, scoped CSS architecture)
- **Backend/Auth:** Supabase
- **Icons:** Lucide React

## 📂 Project Structure

```text
wasfa_diagnostic_website/
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── patient-portal/ # Secured dashboard and sign-in routes
│   │   ├── globals.css     # Global theme variables and resets
│   │   └── ...
│   ├── components/         # Reusable UI components
│   │   ├── home/           # Landing page sections
│   │   ├── layout/         # Global layout wrappers (Navbar, Footer)
│   │   └── portal/         # Dashboard-specific components (Sidebar, Topbar)
│   └── utils/              # Helper functions and Supabase clients
├── public/                 # Static assets (fonts, images, icons)
└── ...
```

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.17.0 or newer)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/muazbinkhalid/wasfa_diagnostic_website.git
   cd wasfa_diagnostic_website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of your project and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🔒 Security & Session Management

This application employs an advanced session management architecture:
- Passwords and auth tokens are handled purely by Supabase Auth on the server.
- The `middleware.ts` intercepts routes to guarantee that unauthenticated users cannot access the `/patient-portal/dashboard` layout.
- A custom `SessionTimeout` component silently synchronizes user activity across multiple browser tabs using `localStorage`. If 15 minutes of inactivity pass, the session is securely wiped to protect patient privacy.

## 🎨 Design Philosophy

The UI actively avoids standard generic frameworks (like default Tailwind) in favor of **Bespoke CSS Modules**. This allows for the implementation of tailored aesthetic tokens, such as specific `clamp()` typography, smooth `cubic-bezier` transitions, and layered radial gradient backgrounds that give the portal a highly premium, "alive" feeling.

---
<div align="center">
  <p>Built with ❤️ for better healthcare experiences.</p>
</div>
