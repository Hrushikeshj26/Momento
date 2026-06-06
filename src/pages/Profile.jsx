import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Save, User, Mail, Fingerprint, Edit3, X, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import PostCard from '../components/PostCard'; 
export default function Profile() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  const { id } = useParams();
  const profileId = id || user?.id; 
  const isOwnProfile = profileId === user?.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Feed State
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;

    async function fetchData() {
      try {
        setLoading(true);
        setPostsLoading(true);

        // 1. Fetch Profile Info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', profileId)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        if (profileData) {
          setUsername(profileData.username || '');
          setFullName(profileData.full_name || '');
          setAvatarUrl(profileData.avatar_url || '');
        }

        // 2. Fetch User's Posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles ( username, full_name, avatar_url ),
            likes ( user_id ),
            comments ( id, content, user_id, created_at, profiles(username, avatar_url) )
          `)
          .eq('user_id', profileId)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);

      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      } finally {
        setLoading(false);
        setPostsLoading(false);
      }
    }

    fetchData();
  }, [profileId]);

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!isOwnProfile) return; // Extra security

    setUpdating(true);
    try {
      const updates = {
        id: user.id,
        username: username,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      setIsEditing(false);
      alert('Profile updated successfully! 🔥');

    } catch (error) {
      console.error('Update error:', error.message);
      alert('Error updating profile: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
  };

  return (
    <div className="mx-auto max-w-2xl min-h-screen px-4 pt-10 pb-20 sm:px-6">
      
      {/* ==========================================
          PROFILE CARD
          ========================================== */}
      <div className={`overflow-hidden w-full rounded-2xl border shadow-xl transition-colors duration-300 mb-10 ${
        isDarkMode ? 'border-slate-800 bg-slate-800' : 'border-slate-200 bg-white'
      }`}>
        
        {/* Header Section */}
        <div className={`p-6 sm:p-10 border-b flex flex-col items-center text-center transition-colors ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className={`mb-4 h-24 w-24 rounded-full object-cover border-4 shadow-xl ${isDarkMode ? 'border-slate-700' : 'border-white'}`} />
          ) : (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 text-white shadow-xl">
              <User className="h-10 w-10" />
            </div>
          )}
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {fullName || username || 'Awesome User'}
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            @{username || 'username'}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !isEditing ? (
            
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Private info - Only visible if it's your own profile */}
              {isOwnProfile && (
                <div className="space-y-4">
                  <div className={`flex items-center gap-4 rounded-xl p-4 border transition-colors ${
                    isDarkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Mail className={`h-5 w-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Email Address</p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{user.email}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 rounded-xl p-4 border transition-colors ${
                    isDarkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Fingerprint className={`h-5 w-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <div className="overflow-hidden">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Account ID</p>
                      <p className={`truncate text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{user.id}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Button - Only visible if it's your own profile */}
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:bg-indigo-700"
                >
                  <Edit3 className="h-5 w-5" />
                  Update Profile
                </button>
              )}
            </div>

          ) : (
            // Edit Form (Remains same)
            <form onSubmit={updateProfile} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* ... [Edit Form Code exact same as before] ... */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Username <span className="text-red-400">*</span></label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full rounded-lg border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`w-full rounded-lg border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Avatar URL</label>
                <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className={`w-full rounded-lg border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}> <X className="h-5 w-5" /> Cancel </button>
                <button type="submit" disabled={updating} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"> {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Save</>} </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ==========================================
          USER'S FEED SECTION
          ========================================== */}
      <div className="w-full">
        <div className={`flex items-center gap-2 border-b pb-4 mb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-300'}`}>
          <ImageIcon className={`h-5 w-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
          <h3 className={`text-xl font-bold tracking-wide ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {isOwnProfile ? 'Your Posts' : 'Posts'}
          </h3>
          <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-200 text-indigo-600'
          }`}>
            {posts.length}
          </span>
        </div>

        {postsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className={`h-8 w-8 animate-spin ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
        ) : posts.length === 0 ? (
          <div className={`rounded-xl border border-dashed py-12 text-center transition-colors ${
            isDarkMode ? 'border-slate-700 bg-slate-800/50 text-slate-400' : 'border-slate-300 bg-slate-50 text-slate-500'
          }`}>
            <p className="text-base">{isOwnProfile ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}</p>
          </div>
        ) : (
          <div className="space-y-8 flex flex-col items-center">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={user} 
                onDelete={handlePostDeleted} 
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}