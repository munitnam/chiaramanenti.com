# Quick Start Guide

## Prerequisites
- Node.js v24+ installed
- Access to NAS assets at `/mnt/nas/github_munitnam/sites/chiaramanenti.com/`

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure email (optional for contact form):**
   ```bash
   cp .env.example .env
   # Edit .env and add your email credentials
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Update Video IDs (Later)

Edit `public/js/config.json` to update YouTube video IDs for the carousel:

```json
{
  "scoringVideos": [
    { "thumbnail": "caminandes.jpg", "videoId": "ACTUAL_VIDEO_ID_1" },
    { "thumbnail": "kairo-no-tabi.jpg", "videoId": "ACTUAL_VIDEO_ID_2" },
    ...
  ]
}
```

## Assets Location

All assets are served from NAS:
- **Images**: `/mnt/nas/github_munitnam/sites/chiaramanenti.com/selection/`
- **Fonts**: `/mnt/nas/github_munitnam/sites/chiaramanenti.com/fonts/poppins/`
- **Audio**: `/mnt/nas/github_munitnam/sites/chiaramanenti.com/selection/audio/`
- **Bio**: `/mnt/nas/github_munitnam/sites/chiaramanenti.com/selection/bio_en.txt`

## Available Assets

### Images
- `top_image.jpg` - Hero image
- `about.jpg` - About section image
- `guitare_session.jpg` - Session guitar image
- `cort.jpg` - Cort endorsement
- `scoring-par.jpg` - Parallax image before scoring
- `session-par.jpg` - Parallax image before session
- Carousel: `scoring_carousel/*.jpg`
- Logos: `logos/*.svg`

### Audio Files
- `Dune-on-Guitar.mp3`
- `Strange-Deja-vu-cover-v7.mp3`

## Deployment to Hostinger

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/[owner]/chiaramanenti.com.git
   git branch -M main
   git push -u origin main
   ```

2. **Configure Hostinger:**
   - Connect to GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables in Hostinger panel
   - Map NAS paths or upload assets to Hostinger

3. **Set Environment Variables in Hostinger:**
   - `PORT` (usually auto-configured)
   - `EMAIL_SERVICE`
   - `EMAIL_USER`
   - `EMAIL_PASS`

## Troubleshooting

### Port already in use
```bash
pkill -f "node server.js"
npm start
```

### Assets not loading
Check that NAS paths are accessible or update paths in `server.js`

### Contact form not working
Verify email credentials in `.env` file

## Next Steps

1. ✅ Test website locally
2. ⬜ Update YouTube video IDs
3. ⬜ Configure email for contact form
4. ⬜ Push to GitHub
5. ⬜ Deploy to Hostinger dev environment
6. ⬜ Test on mobile devices
7. ⬜ Create main/dev branches
8. ⬜ Plan back-office (Phase 2)

## Support

For questions contact: Julien Muraccioli
