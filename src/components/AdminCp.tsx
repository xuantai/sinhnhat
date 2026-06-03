import React, { useState, useEffect } from 'react';
import { Settings, Save, Image as ImageIcon, Music, Type, Plus, Trash2, User, Calendar } from 'lucide-react';

interface AppConfig {
  images: string[];
  musicUrl: string;
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
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  if (loading || !config) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <Settings className="text-rose-500" />
          <h1 className="text-2xl font-bold font-display text-gray-800">Admin Control Panel</h1>
        </div>

        <div className="space-y-8">
          {/* Mật khẩu */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu Admin</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (Mặc định: admin123)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            />
          </div>

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
              Link nhạc nền
            </label>
            <p className="text-sm text-gray-500 mb-3">Có thể dùng link YouTube, Google Drive, SoundCloud, MP3 trực tiếp hoặc mã nhúng iframe (ví dụ từ ZingMP3).</p>
            <input 
              type="text" 
              value={config.musicUrl}
              onChange={e => setConfig({ ...config, musicUrl: e.target.value })}
              placeholder="https://...mp3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono text-sm"
            />
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
