# Birthday Card Extravaganza 🎉

A beautiful, customizable birthday card web application built with React, Vite, and Express. Includes an Admin Control Panel for easy content and configuration updates!

## Features

- 💌 **Customizable Content**: Change the recipient's name, sender's name, message, and date of the birthday.
- 🖼️ **Image Gallery/Slideshow**: Add images to personalize the card.
- 🎵 **Background Music**: Autoplay background music for an immersive experience.
- ⚙️ **Admin Control Panel**: An intuitive graphical interface (located at `/admin`) allowing you to edit all configurations without touching the code.
- 🌐 **VPS/CloudPanel Ready**: Configured for simple deployment (supports Nginx and PM2).
- 📱 **Responsive Design**: Works on Desktop, Tablet, and Mobile.

## Prerequisites

- **Node.js** (v18 or higher)
- **NPM** (or Yarn/PNPM)
- **Git**

## Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up `.env` file:**
   Copy `.env.example` to `.env` and adjust the configuration as necessary.
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:3000` (or whichever `PORT` you configured).

## Build for Production

1. **Build the application:**
   ```bash
   npm run build
   ```
   This command builds the frontend using Vite and bundles the Express server using ESBuild into `dist/server.cjs`.

2. **Start the production server:**
   ```bash
   npm run start
   ```
   Or use PM2 for background process management:
   ```bash
   pm2 start dist/server.cjs --name "birthday-app"
   pm2 save
   ```

## Admin Control Panel

Once the app is running, navigate to the `/admin` path to access the Admin Control Panel. From here, you can easily alter the text, images, and background music used in your personalized birthday card. Any changes are saved to `birthday_config.json` and reflect immediately without a server restart!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
