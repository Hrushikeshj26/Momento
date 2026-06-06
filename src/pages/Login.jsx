import { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, HeartHandshake, Loader2, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

const MOMENTO_QUOTES = [
  "Every moment tells a story.",
  "Capture the echoes of yesterday.",
  "Your history, preserved perfectly.",
  "A timeline of your life's best chapters.",
  "Turn fleeting seconds into lasting legacies."
];

export default function Login() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); 
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Quote Rotation Logic
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % MOMENTO_QUOTES.length);
    }, 4000); // Change quote every 4 seconds

    return () => clearInterval(quoteInterval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        navigate('/home'); 
        
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: data.user.id, 
                username: email.split('@')[0],
              }
            ]);
            
          if (profileError) throw profileError;
        }

        alert('Account created successfully! You can now sign in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex min-h-screen items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-500 ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Full Screen Abstract Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 bg-size-[32px_32px] transition-opacity duration-500 ${
          isDarkMode 
            ? 'bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] opacity-100' 
            : 'bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] opacity-100'
        }`}></div>
        
        {/* SLOW PULSE ORBS HERE */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-75 h-75 sm:w-150 sm:h-150 bg-indigo-600 rounded-full filter blur-[100px] sm:blur-[150px] opacity-25 animate-pulse"
          style={{ animationDuration: '4s' }}
        ></div>
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-75 h-75 sm:w-150 sm:h-150 bg-purple-600 rounded-full filter blur-[100px] sm:blur-[150px] opacity-25 animate-pulse" 
          style={{ animationDuration: '4s'}}
        ></div>
      </div>

      {/* ==========================================
          SPLIT DESIGN GLASSMORPHISM CARD
          ========================================== */}
      <div className={`relative z-10 w-full max-w-4xl rounded-3xl shadow-2xl backdrop-blur-xl border flex flex-col md:flex-row overflow-hidden min-h-80 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-700/50 shadow-indigo-900/10' 
          : 'bg-white/80 border-white/60 shadow-indigo-200/30'
      }`}>
        
        {/* ==========================================
            LEFT SIDE: BRANDING & QUOTES (Gradient)
            ========================================== */}
        <div className={`flex flex-col items-center justify-center text-center p-10 md:w-1/2 relative transition-colors duration-500 ${
          isDarkMode ? 'bg-slate-950/50' : 'bg-indigo-600'
        }`}>
          {/* Subtle Background Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/80 to-purple-700 opacity-90"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Brand Logo */}
            <div className="mb-6 p-4 bg-white/10 rounded-2xl shadow-inner border border-white/20 backdrop-blur-sm">
              <HeartHandshake className="h-14 w-14 text-white" strokeWidth={2}/>
            </div>
            
            {/* Brand Title */}
            <h1 className="mb-3 text-4xl font-extrabold tracking-tighter text-white">
              Momento
            </h1>
            <div className="w-20 h-1 bg-white rounded-full mb-10"></div>

            {/* Rotating Quotes Section */}
            <div className="relative min-h-25 flex items-center justify-center px-4 max-w-sm">
              <Quote className="absolute top-0 left-0 h-4 w-4 text-white/40 transform -translate-x-3 -translate-y-3 rotate-180" />
              <p className="text-lg italic font-medium text-indigo-50 animate-in fade-in slide-in-from-bottom-2 duration-500" key={currentQuoteIndex}>
                {MOMENTO_QUOTES[currentQuoteIndex]}
              </p>
              <Quote className="absolute bottom-0 right-0 h-4 w-4 text-white/40 transform translate-x-3 translate-y-3" />
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT SIDE: LOGIN/SIGNIN FORM (Glassmorphism)
            ========================================== */}
        <div className="flex flex-col justify-center p-8 sm:p-12 md:w-1/2">
          
          <div className="mb-10 h-15 text-center md:text-left">
            <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {isLogin ? 'Welcome Back..' : 'Get Started..'}
            </h2>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {isLogin 
                ? 'Sign in to access your dashboard & moments.' 
                : 'Create an account to start preserving your memories.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 border border-red-500/20 animate-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{errorMsg}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full text-sm rounded-xl border p-3.5 pl-12 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isDarkMode 
                      ? 'border-slate-700/60 bg-slate-900/50 text-white placeholder-slate-500 focus:bg-slate-800' 
                      : 'border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-xl border p-3.5 pl-12 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isDarkMode 
                      ? 'border-slate-700/60 bg-slate-900/50 text-white placeholder-slate-500 focus:bg-slate-800' 
                      : 'border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 p-3.5 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className={`mt-10 text-center text-sm border-t transition-colors pt-6 ${
            isDarkMode ? 'border-slate-700/50' : 'border-slate-200'
          }`}>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              className="font-semibold text-indigo-500 hover:text-indigo-600 focus:outline-none transition-colors ml-1"
            >
              {isLogin ? 'Sign up for free' : 'Sign in here'}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}