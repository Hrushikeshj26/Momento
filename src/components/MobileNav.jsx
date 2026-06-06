import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();
  const { isDarkMode } = useTheme(); 
  
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (!error) setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('mobile_realtime_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => fetchUnreadCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);


  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Create', path: '/posts', icon: PlusSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (!user) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t pb-safe pt-2 md:hidden backdrop-blur-xl transition-colors duration-300 ${
      isDarkMode 
        ? 'border-slate-800 bg-slate-950/80 text-white' 
        : 'border-slate-200 bg-white/80 text-slate-900'
    }`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`relative flex flex-col items-center justify-center w-16 h-14 transition-all duration-200 ${
              isActive 
                ? 'text-indigo-500 scale-110' 
                : isDarkMode 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`h-6 w-6 transition-all ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            
            {/* Active Dot Indicator */}
            {isActive && (
              <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-indigo-500" />
            )}

            {/*  Notification Badge */}
            {item.name === 'Notifications' && unreadCount > 0 && (
              <div className="absolute top-1 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-md border-2 border-white dark:border-slate-900">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}