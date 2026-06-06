import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, PlusSquare, HeartHandshake, Settings as SettingsIcon, Bell, Search, Loader2 } from 'lucide-react'; // 👈 Search aur Loader2 add kiye
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isDarkMode } = useTheme(); 
  
  const [unreadCount, setUnreadCount] = useState(0);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!currentUser) return;
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .eq('is_read', false);
        
      if (!error) setUnreadCount(count || 0);
    };

    fetchUnreadCount();
    
    window.addEventListener('notificationRead', fetchUnreadCount);

    return () => {
      window.removeEventListener('notificationRead', fetchUnreadCount);
    };
  }, [user]);
  // Live Search Logic
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .ilike('username', `%${query}%`)
        .limit(5); 

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserClick = (userId) => {
    setSearchQuery(''); 
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const username = user?.email?.split('@')[0] || 'user';

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Create', path: '/posts', icon: PlusSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className={`fixed left-0 top-0 hidden h-screen w-65 flex-col justify-between border-r p-6 md:flex transition-colors duration-300 ${
      isDarkMode 
        ? 'border-slate-800 bg-gray-950 text-white' 
        : 'border-slate-200 bg-white text-slate-900'
    }`}>
      
      {/* Top Part: Logo, Search & Navigation */}
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <Link to="/home" className={`text-3xl font-bold p-2 rounded-xl text-center flex gap-2 items-center justify-center ${isDarkMode ? 'text-indigo-100' : 'text-slate-800'}`}>
          <HeartHandshake className="w-8 h-8 text-indigo-500" />
          <span className='text-indigo-500'>Momento</span>
        </Link>

        {/* 🔍 NAYA: Search Bar UI */}
        <div className="relative px-1 z-50">
          <div className="relative flex items-center">
            <Search className={`absolute left-4 h-4 w-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
              }`}
            />
            {isSearching && <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-indigo-500" />}
          </div>

          {/* 📋 Dropdown Search Results */}
          {searchResults.length > 0 && (
            <div className={`absolute left-1 right-1 mt-2 rounded-xl border shadow-2xl overflow-hidden max-h-60 overflow-y-auto ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              {searchResults.map((searchUser) => (
                <button
                  key={searchUser.id}
                  onClick={() => handleUserClick(searchUser.id)}
                  className={`flex w-full items-center gap-3 p-3 text-left transition-colors ${
                    isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                  }`}
                >
                  {searchUser.avatar_url ? (
                    <img src={searchUser.avatar_url} alt="avatar" className="h-8 w-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase">
                      {searchUser.username?.[0] || '?'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{searchUser.username}</p>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{searchUser.full_name || `@${searchUser.username}`}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path; 

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : isDarkMode
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-5 w-5" />
                  {item.name}
                </div>

                {/* 🔔 BADGE UI */}
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[12px] font-semibold text-white shadow-md">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: User Profile & Logout */}
      <div className={`border-t pt-4 space-y-4 transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        
        {/* User Mini Card */}
        <Link to='/profile' className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 font-bold text-white uppercase shadow-sm">
            {username[0]}
          </div>
          <div className="overflow-hidden">
            <p className={`text-sm font-semibold truncate capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            isDarkMode
              ? 'text-slate-400 hover:bg-red-300/40 hover:text-red-300'
              : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>

        {/* Personal Tag */}
        <div className={`border-t text-[14px] pt-4 space-y-4 transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {new Date().getFullYear()} <span className="text-indigo-600 font-semibold">Momento</span>. All rights reserved,<br/>
            Made with ❤️ by <span className="text-indigo-400 underline font-medium"><a href="https://github.com/Hrushikeshj26" target="_blank" rel="noopener noreferrer">Hrushikeshj26</a></span>
          </p>
        </div>
      </div>

    </div>
  );
}