import { useState } from 'react';
import { Heart, MessageCircle, Share2, Calendar, Send, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

export default function PostCard({ post, currentUser, onDelete }) {
  const { isDarkMode } = useTheme();
  
  const [likes, setLikes] = useState(post?.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  if (!post) return null;

  const isLiked = likes.some((like) => like.user_id === currentUser?.id);
  const profile = post.profiles || {};
  const displayName = profile.full_name || profile.username || 'User';

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmDelete) return;

    setIsDeletingPost(true);
    try {
      // Clean up likes, comments, and notifications related to the post
      await supabase.from('likes').delete().eq('post_id', post.id);
      await supabase.from('comments').delete().eq('post_id', post.id);
      await supabase.from('notifications').delete().eq('post_id', post.id);

      if (post.image_url) {
        const filePath = post.image_url.split('/public/post/').pop();
        if (filePath) {
          await supabase.storage.from('post').remove([filePath]);
        }
      }

      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) throw error;

      if (onDelete) onDelete(post.id);

    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. " + error.message);
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      if (isLiked) {
        setLikes(likes.filter(l => l.user_id !== currentUser.id));
        await supabase.from('likes').delete().match({ post_id: post.id, user_id: currentUser.id });
      } else {
        setLikes([...likes, { user_id: currentUser.id }]);
        await supabase.from('likes').insert([{ post_id: post.id, user_id: currentUser.id }]);

        // 🟢 NOTIFICATION LOGIC ADDED HERE 🟢
        // Don't send notification if the user likes their own post
        if (currentUser.id !== post.user_id) {
          await supabase.from('notifications').insert([{
            user_id: post.user_id, // The owner of the post
            actor_id: currentUser.id, // The person who liked it
            actor_name: currentUser.user_metadata?.username || currentUser.email.split('@')[0], 
            action_type: 'like',
            post_id: post.id
          }]);
        }
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    setIsCommenting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: post.id, user_id: currentUser.id, content: newComment }])
        .select('*, profiles(username, avatar_url)')
        .single();

      if (error) throw error;
      
      setComments([...comments, data]); 
      setNewComment('');

      // 🟢 NOTIFICATION LOGIC ADDED HERE 🟢
      // Don't send notification if the user comments on their own post
      if (currentUser.id !== post.user_id) {
        await supabase.from('notifications').insert([{
          user_id: post.user_id, // The owner of the post
          actor_id: currentUser.id, // The person who commented
          actor_name: currentUser.user_metadata?.username || currentUser.email.split('@')[0], 
          action_type: 'comment',
          post_id: post.id
        }]);
      }
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setComments(comments.filter(c => c.id !== commentId));
    try {
      await supabase.from('comments').delete().eq('id', commentId);
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Post by ${displayName}`,
      text: post.caption || 'Check out this post on Momento!',
      url: window.location.href, 
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <div className={`overflow-hidden md:w-3xl rounded-2xl border shadow-xl transition-all ${
      isDarkMode 
        ? 'border-slate-800 bg-gray-800 hover:border-slate-600' 
        : 'border-slate-200 bg-white hover:border-slate-300'
    } ${isDeletingPost ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
      
      <div className={`flex items-center justify-between border-b transition-colors ${isDarkMode ? 'border-slate-700/50 hover:bg-slate-700/20' : 'border-slate-100 hover:bg-slate-50'}`}>
        
        <Link to={`/profile/${post.user_id}`} className="flex flex-1 items-center gap-3 p-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className={`h-10 w-10 rounded-full object-cover border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`} />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 text-white font-bold">
              {displayName[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className={`text-sm font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
            <p className={`mt-0.5 flex items-center gap-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Calendar className="h-3 w-3" />
              {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </Link>

        {/* Delete Post Button */}
        {currentUser?.id === post.user_id && (
          <div className="pr-4">
            <button 
              onClick={handleDeletePost}
              disabled={isDeletingPost}
              title="Delete this post"
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-700/50' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
              }`}
            >
              {isDeletingPost ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <div className={`flex max-h-150 items-center justify-center overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-slate-100'}`}>
        <img src={post.image_url} alt="Post content" className="h-full w-full object-contain" loading="lazy" />
      </div>

      {/* Footer (Likes, Comments, Share) */}
      <div className="p-4">
        <div className="mb-4 flex items-center gap-5">
          <button onClick={handleLike} className="group flex items-center gap-1 transition-transform hover:scale-110 focus:outline-none">
            <Heart className={`h-7 w-7 transition-colors ${
              isLiked 
                ? 'fill-red-500 text-red-500' 
                : (isDarkMode ? 'text-slate-300 group-hover:text-red-400' : 'text-slate-500 group-hover:text-red-500')
            }`} />
            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>
              {likes.length > 0 ? likes.length : ''}
            </span>
          </button>
          
          <button onClick={() => setShowComments(!showComments)} className="group flex items-center gap-1 transition-transform hover:scale-110 focus:outline-none">
            <MessageCircle className={`h-7 w-7 transition-colors ${
              showComments 
                ? 'text-indigo-500' 
                : (isDarkMode ? 'text-slate-300 group-hover:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-500')
            }`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {comments.length > 0 ? comments.length : ''}
            </span>
          </button>
          
          <button onClick={handleShare} className="group flex items-center transition-transform hover:scale-110 focus:outline-none">
            <Share2 className={`h-7 w-7 transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-green-400' : 'text-slate-500 group-hover:text-green-500'}`} />
          </button>
        </div>

        {post.caption && (
          <div className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <span className={`mr-2 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {profile.username || 'user'}
            </span>
            {' '}{post.caption}
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className={`mt-4 border-t pt-4 animate-in fade-in duration-200 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {comments.length === 0 ? (
                <p className={`text-xs text-center py-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No comments yet. Be the first!</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className={`group flex items-start justify-between gap-2 text-sm rounded-lg px-2 py-1 transition-colors ${
                    isDarkMode ? 'text-slate-300 hover:bg-slate-700/30' : 'text-slate-700 hover:bg-slate-100'
                  }`}>
                    <div className="flex-1">
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.profiles?.username || 'user'}:</span>
                      <span className="wrap-break-word ml-2">{c.content}</span>
                    </div>
                    
                    {currentUser?.id === c.user_id && (
                      <button 
                        onClick={() => handleDeleteComment(c.id)}
                        className={`opacity-0 transition-opacity duration-200 group-hover:opacity-100 p-1 ${
                          isDarkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'
                        }`}
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={`w-full rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 pr-10 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-400' 
                    : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button 
                type="submit" 
                disabled={!newComment.trim() || isCommenting}
                className={`absolute right-2 p-1 disabled:opacity-50 transition-colors ${
                  isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}