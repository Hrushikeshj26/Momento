import { useEffect, useState } from 'react';
import { Bell, Heart, MessageCircle, CheckCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Notifications() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchNotifications = async () => {
      // Agar user abhi tak load nahi hua hai, toh function exit kar do, par loading ko false kar do (warna ghoomega)
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      window.dispatchEvent(new Event('notificationRead'));
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false); 

      if (error) throw error;

      window.dispatchEvent(new Event('notificationRead'));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-12 sm:px-6">
      
      {/* Page Header */}
      <div className={`mb-8 border-b pb-4 flex items-center justify-between transition-colors ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}>
        <div>
          <h1 className={`text-2xl font-bold tracking-wide flex items-center gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <Bell className={`h-7 w-7 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
            Notifications
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Catch up on what you missed.</p>
        </div>
        
        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-slate-800 text-indigo-400 hover:bg-slate-700 hover:text-indigo-300' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-10 text-center text-lg font-medium text-slate-500 animate-pulse">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className={`rounded-xl border border-dashed py-16 text-center transition-colors ${
            isDarkMode ? 'border-slate-700 bg-slate-800/50 text-slate-400' : 'border-slate-300 bg-slate-50 text-slate-500'
          }`}>
            <Bell className="mx-auto h-10 w-10 mb-3 opacity-50" />
            <p className="text-lg">All caught up!</p>
            <p className="text-sm mt-1">You don't have any notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => markAsRead(notif.id)}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer ${
                notif.is_read 
                  ? (isDarkMode 
                      ? 'border-slate-800 bg-gray-700/60 opacity-70 hover:bg-slate-700/80' 
                      : 'border-slate-200 bg-slate-100 opacity-70 hover:bg-slate-200')
                  : (isDarkMode 
                      ? 'border-indigo-500/30 bg-slate-800 shadow-md hover:border-indigo-500/50' 
                      : 'border-indigo-300 bg-white shadow-md hover:border-indigo-400')
              }`}
            >
              {/* Dynamic Icon: Red Heart for Likes, Indigo Bubble for Comments */}
              <div className={`mt-1 rounded-full p-2.5 ${
                notif.action_type === 'like' 
                  ? 'bg-red-400 text-white shadow-sm' 
                  : 'bg-indigo-400 text-white shadow-sm'
              }`}>
                {notif.action_type === 'like' 
                  ? <Heart className="h-5 w-5 fill-current" /> 
                  : <MessageCircle className="h-5 w-5 fill-current" />
                }
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  <span className={`font-bold capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{notif.actor_name}</span>{' '}
                  {notif.action_type === 'like' ? 'liked your post.' : 'commented on your post.'}
                </p>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  {new Date(notif.created_at).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {/* Unread Indicator Dot */}
              {!notif.is_read && (
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 mt-2 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}