import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import multer from 'multer';

const app = express();
const PORT = parseInt(process.env.PORT || "3000");

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const CONFIG_FILE = path.join(process.cwd(), 'birthday_config.json');

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'music-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'audio/mpeg' || path.extname(file.originalname).toLowerCase() === '.mp3') {
      cb(null, true);
    } else {
      cb(new Error('Only MP3 files are allowed'));
    }
  }
});

// Default configuration
let currentConfig = {
  images: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530103862676-de8892bc1cb7?q=80&w=1000&auto=format&fit=crop"
  ],
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  musicStartTime: 0,
  message: "Chúc mừng sinh nhật! Chúc bạn tuổi mới ngập tràn niềm vui, nhiều tiếng cười và luôn hạnh phúc nhé.",
  recipientName: "",
  birthdayDate: "",
  senderName: "",
  openButtonText: "Mở thiệp chúc mừng",
  pageTitle: "",
};

// Check if file exists, load it
if (fs.existsSync(CONFIG_FILE)) {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    currentConfig = { ...currentConfig, ...JSON.parse(data) };
  } catch (err) {
    console.error("Error reading config file", err);
  }
}

// Function to save config to local file
const saveConfig = () => {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig, null, 2));
  } catch (err) {
    console.error("Error writing config file", err);
  }
};

// API Routes
app.get('/api/config', (req, res) => {
  res.json(currentConfig);
});

app.post('/api/upload-music', upload.single('music'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No files were uploaded or invalid file format.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Mật khẩu không đúng!" });
  }
});

app.post('/api/config', (req, res) => {
  const { password, config } = req.body;
  // Simple protection for the mock admincp
  if (password !== 'admin123') {
    return res.status(401).json({ error: "Mật khẩu không đúng!" });
  }

  currentConfig = { ...currentConfig, ...config };
  saveConfig();
  res.json({ success: true, config: currentConfig });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
