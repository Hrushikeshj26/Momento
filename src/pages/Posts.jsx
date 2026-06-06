import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2, Send, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Posts() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Bhai, image 5MB se choti honi chahiye!');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Bhai, bina photo ke post kaise banayega? Ek image select kar le!');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('posts')
        .insert([
          { 
            user_id: user.id, 
            image_url: publicUrl, 
            caption: caption.trim() 
          }
        ]);

      if (dbError) throw dbError;

      alert('Post created successfully! 🎉');
      navigate('/home'); 

    } catch (error) {
      console.error('Error creating post:', error.message);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-12 sm:px-6">
      
      {/* Header */}
      <div className={`mb-8 border-b pb-4 transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-300'}`}>
        <h1 className={`text-2xl font-bold tracking-wide flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          <ImagePlus className="h-7 w-7 text-indigo-500"/>
          Create New Post
        </h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Share a moment with your friends.</p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleCreatePost} className={`overflow-hidden rounded-2xl border shadow-xl transition-colors duration-300 ${
        isDarkMode ? 'border-slate-800 bg-slate-800' : 'border-slate-200 bg-white'
      }`}>
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Image Upload Area */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Photo <span className="text-red-400">*</span>
            </label>
            
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current.click()}
                className={`flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  isDarkMode 
                    ? 'border-slate-600 bg-slate-900/50 hover:bg-slate-700/50 hover:border-indigo-500' 
                    : 'border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400'
                }`}
              >
                <div className={`p-4 rounded-full mb-3 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                  <ImagePlus className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                </div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Click to browse</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-black flex justify-center items-center h-80 group">
                <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden" 
            />
          </div>

          {/* Caption Textarea */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Caption
            </label>
            <textarea
              rows="4"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your post..."
              className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            ></textarea>
          </div>

        </div>

        {/* Form Footer */}
        <div className={`p-4 sm:px-8 border-t flex justify-end transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-900/30' : 'border-slate-100 bg-slate-50'}`}>
          <button
            type="submit"
            disabled={isUploading || !file}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Share Post
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}