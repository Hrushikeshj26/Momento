# 📱 Momento - Real-Time Social Media WebApp

![Momento Banner](https://via.placeholder.com/1200x600?text=Momento+App+Screenshot+Here) 
*(Note: Upload an actual screenshot of your app in Dark Mode to your repo and replace this link)*

**Note: This project is a personal portfolio piece demonstrating advanced frontend development skills.**


**Momento** is a fully responsive, real-time social media web application. I built this MVP from scratch to demonstrate end-to-end frontend architecture, complex state management, and seamless Backend-as-a-Service (BaaS) integration.

**🔗 [Live Demo on Vercel](#) | 📺 [Watch the Video Walkthrough on LinkedIn](#)**

---

## 🚀 Key Features

*   **📱 Mobile-First & Responsive:** Conditional layout architecture featuring a full Sidebar for desktop users and a sleek, Glassmorphic Bottom Navigation bar for mobile users.
*   **⚡ Real-Time Feed & Interactions:** Posts, Likes, and Comments update optimistically on the frontend and sync instantly using Supabase.
*   **🔔 Live Notifications:** Utilizes Supabase Realtime subscriptions to instantly alert users when someone interacts with their posts, complete with dynamic unread badge counters.
*   **🌓 Advanced Theming:** Custom Dark/Light mode implemented globally using React Context API.
*   **🔒 Secure Authentication:** End-to-end user login/signup flow using Supabase Auth.
*   **📸 Media Management:** Secure image uploads with file size validation, stored and served via Supabase Storage buckets.
*   **🔍 Live Search:** Case-insensitive, real-time database querying in the navigation bar to discover and view public user profiles.
*   **👤 Dynamic Profiles:** Reusable profile component that intelligently switches between "Personal Edit Mode" and "Public View Mode" based on URL parameters.
*   **🧹 Data Integrity:** Users can safely delete their own posts, which triggers a clean cascade to remove associated images from storage, likes, and comments to prevent orphaned data.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend Library:** React.js (Vite)
*   **Styling:** Tailwind CSS (utility-first, highly responsive design)
*   **Routing:** React Router DOM v6
*   **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Realtime)
*   **Icons:** Lucide React

### Why this stack?
I chose **React** for its component-driven architecture, making the UI highly reusable. **Supabase** was selected over building a custom Node.js/MERN backend to act as a Serverless architecture. This allowed me to focus entirely on delivering a pixel-perfect, high-performance Frontend/Mobile experience while maintaining strict Row Level Security (RLS) for user data.

---

## ⚙️ Local Setup & Installation

Want to run this project locally? Follow these steps:

1. **Clone the repository:**
   git clone [https://github.com/Hrushikeshj26/momento-app.git](https://github.com/Hrushikeshj26/momento-app.git)
   cd momento-app
Install dependencies:

2. **Install dependencies:**
   npm install
   
3. **Environment Variables:**
Create a .env file in the root directory and add your Supabase credentials. (Never commit this file!)

   Code snippet
         VITE_SUPABASE_URL=your_supabase_project_url
         VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
4. **Start the development server:**
   npm run dev

---

## 👨‍💻 About the Developer

Built from scratch by **Hrushikesh Jadhav**. 

I am a Frontend Developer specializing in React and modern UI/UX architecture. I build web applications that are fast, accessible, and visually engaging. I am actively looking for remote Frontend web development opportunities.

*   **Portfolio:** [Portfolio](https://hrushij-dev.vercel.app/)
*   **LinkedIn:** [LinkedIn Profile](https://www.linkedin.com/in/hrushikeshj26/)
*   **GitHub:** [@Hrushikeshj26](https://github.com/Hrushikeshj26)

---
