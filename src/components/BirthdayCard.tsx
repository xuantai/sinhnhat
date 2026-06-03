import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Gift, Volume2, VolumeX } from 'lucide-react';
import ReactPlayer from 'react-player';
import FlowerPetals from './FlowerPetals';

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

const Typewriter = ({ text, start }: { text: string; start: boolean }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!start) return;
    setIsTyping(true);
    setDisplayed("");
    
    let currentLength = 0;
    let timerId: NodeJS.Timeout;

    const initialDelay = setTimeout(() => {
      timerId = setInterval(() => {
        currentLength++;
        setDisplayed((text || "").substring(0, currentLength));
        if (currentLength >= (text || "").length) {
          clearInterval(timerId);
          setIsTyping(false);
        }
      }, 40); 
    }, 1000);

    return () => {
      clearTimeout(initialDelay);
      if (timerId) clearInterval(timerId);
    };
  }, [text, start]);

  return (
    <div className="text-2xl leading-relaxed text-[#5d4037]">
      {displayed}
      {isTyping && <span className="typewriter-cursor">&nbsp;</span>}
    </div>
  );
};

export default function BirthdayCard() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch Config
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        if (data.pageTitle && data.pageTitle.trim() !== '') {
          document.title = data.pageTitle;
        } else {
          document.title = `From ACXT to ${data.recipientName || 'bạn'}`;
        }
      })
      .catch(err => console.error("Could not load config", err));
  }, []);

  // Slideshow
  useEffect(() => {
    if (!isOpened || !config || config.images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % config.images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, [isOpened, config]);

  const handleOpenCard = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
    }
  };

  if (!config) {
    return <div className="min-h-screen flex items-center justify-center text-pink-500">Đang tải...</div>;
  }

  // Calculate if it's an iframe (like zingmp3 embed loop)
  const isIframe = config.musicUrl.includes('<iframe') || config.musicUrl.includes('embed');

  const getPlayableUrl = (url: string) => {
    if (!url) return '';
    const driveRegex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([\w-]+)/;
    const driveMatch = url.match(driveRegex);
    if (driveMatch) {
      return `https://docs.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-[#fff5f6] flex flex-col items-center py-10 px-4 md:px-10 justify-between relative overflow-hidden font-serif text-[#5d4037]">
      <FlowerPetals />

      {/* Hidden audio element if direct link */}
      {!isIframe && config.musicUrl && (
        <audio 
          ref={audioRef}
          src={getPlayableUrl(config.musicUrl)}
          loop
          muted={isMuted}
          className="hidden"
          playsInline
        />
      )}
      
      {/* Absolute hidden iframe if embedded player */}
      {isIframe && config.musicUrl && isOpened && (
        <div 
          className="absolute w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-0" 
          dangerouslySetInnerHTML={{ 
            __html: config.musicUrl
                      .replace('<iframe', '<iframe allow="autoplay" allowfullscreen')
                      .replace(/src="([^"]+)"/, (match, src) => `src="${src}${src.includes('?') ? '&' : '?'}autoplay=1"`)
          }} 
        />
      )}

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div 
            key="intro"
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#fff5f6]"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCard}
              className="relative z-20 bg-white/50 backdrop-blur-md border border-white/60 text-[#5d4037] px-8 py-6 flex flex-col items-center gap-4 rounded-3xl shadow-xl hover:bg-white/70 transition-colors"
            >
              <Gift size={48} className="text-[#ffb7c5] animate-bounce" />
              <span className="text-2xl font-bold font-serif italic">{config.openButtonText || 'Mở thiệp chúc mừng'}</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 w-full flex flex-col items-center gap-12 z-20 mt-4 md:mt-8 mb-12"
          >
            {/* Title */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center flex flex-col items-center mb-4"
            >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2 italic drop-shadow-sm">
            Happy Birthday
          </h1>
          {(config.recipientName || config.birthdayDate) && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="text-xl md:text-2xl opacity-80 uppercase tracking-widest font-sans mt-2"
            >
              {config.recipientName} {config.recipientName && config.birthdayDate ? '— ' : ''}{config.birthdayDate}
            </motion.p>
          )}
        </motion.div>

        {/* Polaroids / Image Slideshow */}
        <div className="relative">
          <div className="absolute -inset-4 bg-white/40 rounded-[40px] blur-xl pointer-events-none"></div>
          <div className="relative w-[320px] md:w-[500px] h-[350px] bg-white p-6 shadow-2xl rounded-2xl transform rotate-2">
            <div className="w-full h-full bg-[#fce4ec] rounded-lg overflow-hidden flex items-center justify-center border-4 border-[#fff1f3] relative">
              <AnimatePresence mode="wait">
                {config.images.length > 0 ? (
                  <motion.img
                    key={currentImageIndex}
                    src={config.images[currentImageIndex]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 opacity-40">
                    <Gift size={32} className="mb-4" />
                    <span className="text-sm uppercase tracking-tighter">Chưa có ảnh</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute bottom-8 right-10 flex gap-2">
               {config.images.map((_, idx) => (
                 <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-[#5d4037]' : 'bg-[#5d4037]/20'}`}></div>
               ))}
               {config.images.length === 0 && (
                 <>
                   <div className="w-2 h-2 rounded-full bg-[#5d4037]/20"></div>
                   <div className="w-2 h-2 rounded-full bg-[#5d4037]"></div>
                   <div className="w-2 h-2 rounded-full bg-[#5d4037]/20"></div>
                 </>
               )}
            </div>
          </div>
        </div>

            {/* Message */}
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#ffb7c5]"></div>
                <span className="text-xs font-sans uppercase tracking-[0.2em] font-semibold opacity-60">Wishes for you</span>
              </div>
              <div className="min-h-[100px] flex items-center">
                <Typewriter text={config.message} start={isOpened} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className="z-10 mt-auto w-full md:px-12 flex flex-row justify-between items-center gap-6 text-[#5d4037] pb-8 relative">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center text-[#5d4037] hover:bg-white/80 transition-colors shadow-sm"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="text-right">
          {config.senderName && (
            <p className="text-xs md:text-sm uppercase tracking-widest opacity-60 font-sans font-semibold">
              From {config.senderName}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
