import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, ArrowRight, Zap, Shield, Sparkles, Code2, 
  UserPlus, ImagePlus, MessageSquare, Layers, Rocket,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function LandingPage() {
  const { isDarkMode, toggleTheme } = useTheme(); 

  return (
    <div className={`relative min-h-screen font-sans transition-colors duration-500 ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* ==========================================
          TOP WRAPPER: NAV & HERO (With Grid Background)
          ========================================== */}
      <div className="relative overflow-hidden">
        
        {/* Background Effects (Only for this section) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Subtle Grid Pattern */}
          <div className={`absolute inset-0 bg-size-[32px_32px] transition-opacity duration-500 ${
            isDarkMode 
              ? 'bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] opacity-100' 
              : 'bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] opacity-100'
          }`}></div>
          
          {/* Glowing Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-100 sm:w-150 h-100 sm:h-150 bg-indigo-600 rounded-full filter blur-[120px] sm:blur-[150px] opacity-20 animate-pulse" style={{ animationDuration : '4s' }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-100 sm:w-150 h-100 sm:h-150 bg-purple-600 rounded-full filter blur-[120px] sm:blur-[150px] opacity-20 animate-pulse" style={{ animationDuration : '4s', animationDelay: '2s' }}></div>
          
          {/* Bottom Fade-Out Gradient (Blends grid into plain background) */}
          <div className={`absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t ${
            isDarkMode ? 'from-slate-950' : 'from-slate-50'
          } to-transparent z-10`}></div>
        </div>

        {/* ==========================================
            NAVBAR
            ========================================== */}
        <nav className={`relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto backdrop-blur-sm ${
          isDarkMode ? 'border-b border-white/5' : 'border-b border-black/5'
        }`}>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <HeartHandshake className="h-6 w-6 text-white" strokeWidth={2.5}/>
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Momento
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'border-slate-800 bg-slate-900/80 text-yellow-400 hover:bg-slate-800 hover:text-yellow-300 shadow-sm' 
                  : 'border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-sm'
              }`}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link 
              to="/login" 
              className={`text-sm font-semibold transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Sign In
            </Link>
            <Link 
              to="/login" 
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* ==========================================
            HERO SECTION
            ========================================== */}
        <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center sm:pt-32">
          <div className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-md ${
            isDarkMode ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' : 'border-indigo-500/20 bg-indigo-50 text-indigo-700'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            V1.0 is now live
          </div>

          <h1 className={`max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Every moment tells a <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
              beautiful story.
            </span>
          </h1>

          <p className={`mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            A seamless, secure, and blazing-fast social experience. Share your journey, connect in real-time, and experience the web like never before.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
            <Link 
              to="/login" 
              className="group flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 w-full sm:w-auto"
            >
              Join Momento Today
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href="https://github.com/Hrushikeshj26" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 rounded-2xl border px-8 py-4 text-base font-semibold transition-all w-full sm:w-auto ${
                isDarkMode 
                  ? 'border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800' 
                  : 'border-slate-300 bg-white/50 text-slate-900 hover:bg-white'
              }`}
            >
              <Code2 className="h-5 w-5" />
              View GitHub
            </a>
          </div>
        </main>
      </div>

      {/* ==========================================
          FEATURES GRID (Plain Background)
          ========================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-24 sm:pb-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <div className={`rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
            isDarkMode ? 'border-slate-800 bg-slate-900 shadow-indigo-900/10' : 'border-slate-200 bg-white shadow-indigo-100/50'
          }`}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className={`mb-3 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Real-Time Sync</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Powered by Supabase subscriptions. See likes, comments, and new posts appear instantly without ever refreshing the page.
            </p>
          </div>

          <div className={`rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
            isDarkMode ? 'border-slate-800 bg-slate-900 shadow-purple-900/10' : 'border-slate-200 bg-white shadow-purple-100/50'
          }`}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className={`mb-3 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Secure by Default</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Enterprise-grade security and authentication. Your data is protected with Row Level Security (RLS) policies.
            </p>
          </div>

          <div className={`rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
            isDarkMode ? 'border-slate-800 bg-slate-900 shadow-cyan-900/10' : 'border-slate-200 bg-white shadow-cyan-100/50'
          }`}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className={`mb-3 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gorgeous UI</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Crafted with Tailwind CSS and Lucide icons. Includes a fluid Dark/Light mode that respects your system preferences.
            </p>
          </div>

        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS (Step-by-step)
          ========================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24 sm:pb-32">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            How Momento Works
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Getting started is fast and effortless. Join the community in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className={`hidden md:block absolute top-12 left-[15%] w-[70%] h-0.5 border-t-2 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} z-0`}></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${isDarkMode ? 'bg-slate-900 shadow-slate-900/50 border border-slate-800' : 'bg-white shadow-slate-200/50 border border-slate-100'}`}>
              <UserPlus className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1. Create an Account</h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Sign up securely in seconds. Set up your profile and make it yours.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${isDarkMode ? 'bg-slate-900 shadow-slate-900/50 border border-slate-800' : 'bg-white shadow-slate-200/50 border border-slate-100'}`}>
              <ImagePlus className="h-10 w-10 text-purple-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>2. Share Moments</h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Upload photos, write captions, and share your experiences with the world.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${isDarkMode ? 'bg-slate-900 shadow-slate-900/50 border border-slate-800' : 'bg-white shadow-slate-200/50 border border-slate-100'}`}>
              <MessageSquare className="h-10 w-10 text-cyan-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3. Connect & Engage</h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Like, comment, and interact in real-time. Build your community.</p>
          </div>
        </div>
      </section>

      {/* ==========================================
          TECH STACK (For Recruiters/Devs)
          ========================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24 sm:pb-32 text-center">
        <p className={`text-sm font-semibold uppercase tracking-widest mb-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Powered by modern technology
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          {['React.js', 'Tailwind CSS', 'Supabase', 'Lucide Icons', 'Vite'].map((tech, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layers className="h-4 w-4 opacity-70" />
              <span className="font-semibold">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          BOTTOM CTA
          ========================================== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-600 to-purple-700 px-8 py-16 sm:px-16 sm:py-24 text-center shadow-2xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to capture your moments?
            </h2>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
              Join Momento today and start building a timeline of your life's best chapters. Setup takes less than a minute.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:scale-105 hover:shadow-xl w-full sm:w-auto"
            >
              Create Free Account
              <Rocket className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className={`relative z-10 border-t py-8 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'} `}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
            © {new Date().getFullYear()} Momento. All rights reserved.
          </p>
          <p className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
            Built by <a href="https://hrushij-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400 transition-colors hover:underline">Hrushikesh Jadhav</a>
          </p>
        </div>
      </footer>

    </div>
  );
}