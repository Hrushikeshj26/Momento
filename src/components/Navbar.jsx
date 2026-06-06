import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartHandshake, Search, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  //  Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  //  Live Search Logic
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

  return (
    <nav className={`sticky top-0 z-50 border-b px-4 py-3 backdrop-blur-xl transition-colors duration-300 ${
      isDarkMode 
        ? 'border-slate-800 bg-slate-950/80 text-white' 
        : 'border-slate-200 bg-white/90 text-slate-900'
    }`}>
      <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
        
        <Link to="/home" className={`flex shrink-0 items-center justify-center rounded-xl p-1.5 transition-colors ${
          isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
        }`}>
          <HeartHandshake className="h-7 w-7 text-indigo-500" />
        </Link>

        {/* Center: Live Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <div className="relative flex items-center">
            <Search className={`absolute left-3 h-4 w-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className={`w-full rounded-full border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white'
              }`}
            />
            {isSearching && <Loader2 className="absolute right-3 h-3 w-3 animate-spin text-indigo-500" />}
          </div>

          {/* 📋 Dropdown Search Results */}
          {searchResults.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-2 rounded-xl border shadow-2xl overflow-hidden max-h-60 overflow-y-auto ${
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

        {/* Right Side: Settings Button */}
        <Link 
          to="/settings" 
          className={`shrink-0 rounded-full p-2 transition-colors ${
            isDarkMode 
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <SettingsIcon className="h-6 w-6" />
        </Link>

      </div>
    </nav>
  );
}