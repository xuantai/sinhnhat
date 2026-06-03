import React, { useState, useEffect } from 'react';
import { Settings, Save, Image as ImageIcon, Music, Type, Plus, Trash2, User, Calendar, Home, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppConfig {
  images: string[];
  musicUrl: string;
  musicStartTime?: number;
  message: string;
  recipientName: string;
  birthdayDate: string;
  senderName: string;
  openButtonText: string;
  pageTitle?: string;
}

export default function AdminCp() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => console.error("Could not load config", err));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setAuthStatus('idle');

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, config })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAuthStatus('success');
      } else {
        setAuthStatus('error');
      }
    } catch(err) {
      setAuthStatus('error');
    }
    setSaving(false);
  };

  const handleAddImage = () => {
    setConfig(prev => prev ? { ...prev, images: [...prev.images, ""] } : null);
  };

  const handleRemoveImage = (index: number) => {
    setConfig(prev => {
      if (!prev) return null;
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleImageChange = (index: number, value: string) => {
    setConfig(prev => {
      if (!prev) return null;
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const handleUploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== 'audio/mpeg' && !file.name.toLowerCase().endsWith('.mp3')) {
      alert('Vui lòng chỉ tải lên file MP3.');
      return;
    }

    setUploadingMusic(true);
    const formData = new FormData();
    formData.append('music', file);

    try {
      const res = await fetch('/api/upload-music', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setConfig(prev => prev ? { ...prev, musicUrl: data.url } : null);
        alert('Tải nhạc thành công!');
      } else {
        alert(data.error || 'Lỗi khi tải nhạc.');
      }
    } catch (err) {
      alert('Lỗi tải tệp tin.');
    }
    setUploadingMusic(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Sai mật khẩu!');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối Server.');
    }
  };

  if (loading || !config) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <Settings size={32} className="text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
            <p className="text-sm text-gray-500 mt-2 text-center">Đăng nhập để thay đổi cấu hình thiệp</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu truy cập</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-sm mt-2 font-medium">{loginError}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
            >
              <LogIn size={20} />
              Đăng nhập
            </button>
          </form>
          
          <div className="mt-8 text-center">
             <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-rose-500 font-medium transition-colors">
               <Home size={18} />
               Quay lại Trang chủ
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <Settings className="text-rose-500" />
            <h1 className="text-2xl font-bold font-display text-gray-800">Cấu hình thiệp</h1>
          </div>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            <Home size={16} />
            Trang chủ
          </Link>
        </div>

        <div className="space-y-8">

          {/* Thông tin thẻ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
                <User size={20} className="text-rose-500" /> 
                Tên người nhận
              </label>
              <input 
                type="text" 
                value={config.recipientName || ''}
                onChange={e => setConfig({ ...config, recipientName: e.target.value })}
                placeholder="VD: Mai Phương"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
                <Calendar size={20} className="text-rose-500" /> 
                Ngày sinh
              </label>
              <input 
                type="text" 
                value={config.birthdayDate || ''}
                onChange={e => setConfig({ ...config, birthdayDate: e.target.value })}
                placeholder="VD: 20.10.2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
                <User size={20} className="text-rose-500" /> 
                Tên người gửi (From)
              </label>
              <input 
                type="text" 
                value={config.senderName || ''}
                onChange={e => setConfig({ ...config, senderName: e.target.value })}
                placeholder="VD: Tuấn Bắc"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
                <Type size={20} className="text-rose-500" /> 
                Tiêu đề trình duyệt (Tab)
              </label>
              <input 
                type="text" 
                value={config.pageTitle || ''}
                onChange={e => setConfig({ ...config, pageTitle: e.target.value })}
                placeholder={`VD: From ACXT to ${config.recipientName || 'Bạn'}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
                <Type size={20} className="text-rose-500" /> 
                Text nút mở thiệp
              </label>
              <input 
                type="text" 
                value={config.openButtonText !== undefined ? config.openButtonText : 'Mở thiệp chúc mừng'}
                onChange={e => setConfig({ ...config, openButtonText: e.target.value })}
                placeholder="VD: Mở thiệp chúc mừng"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Âm nhạc */}
          <div>
            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
              <Music size={20} className="text-rose-500" /> 
              Nhạc nền
            </label>
            <p className="text-sm text-gray-500 mb-3">Tải lên file MP3 hoặc dùng URL có sẵn. Chọn thời gian bắt đầu phát.</p>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tải nhạc mới (.mp3)</label>
                <input 
                  type="file" 
                  accept=".mp3,audio/mpeg"
                  onChange={handleUploadMusic}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                />
                {uploadingMusic && <p className="text-xs text-rose-500 mt-1">Đang tải lên...</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hoặc Link nhạc (hiện tại)</label>
                <input 
                  type="text" 
                  value={config.musicUrl}
                  onChange={e => setConfig({ ...config, musicUrl: e.target.value })}
                  placeholder="https://...mp3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phát từ giây thứ</label>
                <input 
                  type="number" 
                  min="0"
                  value={config.musicStartTime || 0}
                  onChange={e => setConfig({ ...config, musicStartTime: parseInt(e.target.value) || 0 })}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Lời chúc */}
          <div>
            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-2">
              <Type size={20} className="text-rose-500" /> 
              Lời chúc sinh nhật
            </label>
            <textarea 
              value={config.message}
              onChange={e => setConfig({ ...config, message: e.target.value })}
              rows={4}
              placeholder="Nhập lời nhắn..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-lg font-medium text-gray-800">
                <ImageIcon size={20} className="text-rose-500" /> 
                Hình ảnh cho Slideshow
              </label>
              <button 
                onClick={handleAddImage}
                className="flex items-center gap-1 text-sm bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Plus size={16} /> Thêm ảnh
              </button>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              {config.images.map((img, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="bg-white border border-gray-200 text-gray-500 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm">{idx + 1}</span>
                  <input 
                    type="text" 
                    value={img}
                    onChange={e => handleImageChange(idx, e.target.value)}
                    placeholder="https://...jpg"
                    className="flex-1 px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono text-sm"
                  />
                  <button 
                    onClick={() => handleRemoveImage(idx)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {config.images.length === 0 && (
                <p className="text-gray-400 text-center py-4 text-sm">Chưa có hình ảnh nào.</p>
              )}
            </div>
          </div>

          {/* Nút lưu */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <div>
              {authStatus === 'success' && <span className="text-green-600 font-medium">Lưu thành công!</span>}
              {authStatus === 'error' && <span className="text-red-600 font-medium">Lưu thất bại! Sai mật khẩu?</span>}
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
