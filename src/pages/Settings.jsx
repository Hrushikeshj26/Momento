import { useState, useEffect } from 'react';
import { Bell, Lock, Moon, Sun, Shield, UserX, ChevronRight, Loader2, Settings as SettingsIcon, TriangleAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme(); 
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  useEffect(() => {
    const savedNotifs = localStorage.getItem('momento_email_notifs') !== 'false';
    setEmailNotifs(savedNotifs);
  }, []);

  const handleNotifToggle = () => {
    const newVal = !emailNotifs;
    setEmailNotifs(newVal);
    localStorage.setItem('momento_email_notifs', newVal);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      alert("Bhai, password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    setUpdatingPass(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      alert("Password updated successfully! 🔒");
      setNewPassword(''); 
    } catch (error) {
      console.error("Password update error:", error);
      alert(error.message);
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-12 sm:px-6">
      
      {/* Page Header */}
      <div className={`mb-8 border-b pb-4 transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-300'}`}>
        <h1 className={`text-2xl font-bold tracking-wide flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          <SettingsIcon className="h-7 w-7 text-indigo-400"/>
          Settings
        </h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage your account preferences and security.</p>
      </div>

      <div className="space-y-8">
        
        {/* ==========================================
            1. PREFERENCES SECTION
            ========================================== */}
        <div className={`overflow-hidden rounded-2xl border shadow-lg transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}>
          <div className={`border-b p-4 ${isDarkMode ? 'border-slate-700/50 bg-slate-600/50' : 'border-slate-200 bg-slate-100'}`}>
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Shield className="h-5 w-5 text-indigo-400" />
              Preferences
            </h2>
          </div>
          
          <div className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-200'}`}>
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-2 ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Dark Mode</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Default app theme</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-2 ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Email Notifications</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Receive updates about activity</p>
                </div>
              </div>
              <button 
                onClick={handleNotifToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifs ? 'bg-indigo-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            2. SECURITY SECTION (CHANGE PASSWORD)
            ========================================== */}
        <div className={`overflow-hidden rounded-2xl border shadow-lg transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}>
          <div className={`border-b p-4 ${isDarkMode ? 'border-slate-700/50 bg-slate-600/50' : 'border-slate-200 bg-slate-100'}`}>
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Lock className="h-5 w-5 text-indigo-400" />
              Security
            </h2>
          </div>
          
          <div className="p-5">
            <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className={`w-full rounded-lg border px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                    isDarkMode 
                      ? 'border-slate-600 bg-slate-900 text-white' 
                      : 'border-slate-300 bg-slate-50 text-slate-900'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={updatingPass || !newPassword}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                {updatingPass ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* ==========================================
            3. DANGER ZONE
            ========================================== */}
        <div className={`overflow-hidden rounded-2xl border shadow-lg transition-colors ${isDarkMode ? 'border-red-900/30 bg-slate-800' : 'border-red-200 bg-white'}`}>
          <div className={`border-b p-4 ${isDarkMode ? 'border-red-500/30 bg-red-900/40' : 'border-red-200 bg-red-50'}`}>
            <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <TriangleAlert className="h-5 w-5" />
              Danger Zone
            </h2>
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Delete Account</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Permanently remove your data</p>
            </div>
            <button 
              onClick={() => alert("Bhai, account delete karne ke liye Supabase par Edge functions lagte hain. Abhi ke liye bas log out kar le!")}
              className="flex items-center gap-1 rounded-lg border border-red-500/50 text-red-400 px-4 py-2 text-sm font-semibold transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              Delete <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}