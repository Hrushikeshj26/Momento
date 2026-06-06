import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Pages & Components
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Posts from './pages/Posts';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <BrowserRouter>
        <Routes>
          {/* ----- PUBLIC ROUTES ----- */}
          <Route path="/" element={<LandingPage />} />  {/* <-- Root path */}
          <Route path="/login" element={<Login />} />

          {/* ----- PROTECTED ROUTES ----- */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} /> 
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/notifications" element={<Notifications/>} />
            <Route path="/posts" element={<Posts/>} />
            <Route path="/settings" element={<Settings/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}