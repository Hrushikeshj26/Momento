import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme(); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles ( username, full_name, avatar_url ),
          likes ( user_id ),
          comments ( id, content, user_id, created_at, profiles(username, avatar_url) )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-12 sm:px-6 flex justify-center">
      <div className="mt-8 space-y-8 w-full md:w-3xl">
        
        <div className={`flex items-center justify-between border-b pb-4 transition-colors ${
          isDarkMode ? 'border-slate-800' : 'border-slate-300'
        }`}>
          <h2 className={`text-2xl font-bold tracking-wide transition-colors ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Your Feed
          </h2>
        </div>

        {loading ? (
          <div className={`py-10 text-center text-lg font-medium animate-pulse ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Loading your feed...
          </div>
        ) : posts.length === 0 ? (
          <div className={`rounded-xl border border-dashed py-16 text-center transition-colors ${
            isDarkMode 
              ? 'border-slate-700 bg-slate-800/50 text-slate-400' 
              : 'border-slate-300 bg-slate-50 text-slate-500'
          }`}>
            <p className="text-lg">No posts yet.</p>
            <p className="text-sm">Be the first one to post something awesome!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUser={user} 
              onDelete={handlePostDeleted} 
            />
          ))
        )}
      </div>
    </div>
  );
}