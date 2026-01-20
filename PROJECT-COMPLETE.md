# Chiara Manenti Website - Project Complete ✅

## 📋 Project Overview

**Status**: Frontend Complete - Ready for Deployment  
**Date**: 2026-01-20  
**Location**: `/mnt/nas/github_munitnam/git/chiaramanenti.com/`  
**GitHub Repo**: Ready for push to `https://github.com/[owner]/chiaramanenti.com`

---

## ✅ Completed Features

### 1. **Single-Page Responsive Website**
- Full-screen hero image (top_image.jpg)
- Smooth scrolling navigation
- Mobile-optimized (portrait mode prioritizes height)
- Parallax effects on scroll

### 2. **Navigation System**
- Top navigation bar (visible during hero scroll)
- Menu button (appears after hero section)
- Full-page overlay menu with blur effect
- Smooth transitions between sections
- Order: Showreel → Scoring → Session Guitar → About → Contact

### 3. **Showreel Section**
- YouTube embed with autoplay on scroll
- Currently using: `https://www.youtube.com/watch?v=FBCdo1rn0sY`
- Configurable via `config.json`

### 4. **Scoring Section**
- Interactive carousel with 4 thumbnails
- Images from `/mnt/nas/.../scoring_carousel/`:
  - caminandes.jpg
  - kairo-no-tabi.jpg
  - kgt.jpg
  - raven-song.jpg
- Click to open video in modal overlay
- Video IDs configurable in `config.json`

### 5. **Parallax Images** (Full-width between sections)
- Before Scoring: `scoring-par.jpg`
- Before Session: `session-par.jpg`
- Before About: `top_image.jpg`
- Fixed background attachment with smooth scroll effect

### 6. **Session Guitar Section**
- Image: `guitare_session.jpg`
- Custom audio player with:
  - Waveform visualization (50 bars)
  - Play/Pause button
  - Progress tracking
  - Click-to-seek functionality
- Audio files:
  - Dune-on-Guitar.mp3
  - Strange-Deja-vu-cover-v7.mp3

### 7. **About Section**
- Left: `about.jpg` image
- Right: Bio from `bio_en.txt`
- Two SVG logos (white, centered):
  - COMPOCCITANIE.svg
  - KSCOLTA.svg
- Clickable Cort endorsement image
  - Links to: `https://www.cortguitars.com/artist/chiara-manenti/`

### 8. **Contact Section**
- Contact form with fields: Name, Email, Subject, Message
- Server-side email sending to: `chiaramanenticontact@gmail.com`
- Success/error message display
- Form validation

### 9. **Footer**
- Credits: "Pictures by Michel Roux / Website by Julien Muraccioli - All rights reserved"

---

## 🎨 Design Specifications

### Color Palette
```css
--bg-dark: #273736        /* Deep teal-black */
--bg-card: #456165        /* Slate blue-grey */
--text-gold: #cdb996      /* Warm sand/gold */
--accent-bronze: #a48557  /* Bronze */
--text-white: #ffffff     /* White */
```

### Typography
- **Font**: Poppins Regular
- **Location**: `/mnt/nas/.../fonts/poppins/Poppins-Regular.ttf`
- Used for: All text, menu items, section titles

### Responsive Breakpoints
- Desktop: > 768px
- Tablet: 768px - 481px
- Mobile: ≤ 480px

---

## 💻 Technical Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Custom styling, flexbox, grid, animations
- **Vanilla JavaScript** - No framework dependencies
- **Features**:
  - Intersection Observer API (scroll detection)
  - YouTube IFrame API
  - HTML5 Audio API
  - Fetch API for dynamic content

### Backend
- **Node.js v24.11.0**
- **Express v5.2.1** - Web server
- **Nodemailer v7.0.12** - Email sending
- **Dotenv v17.2.3** - Environment configuration

### Assets Serving
All media served from NAS: `/mnt/nas/github_munitnam/sites/chiaramanenti.com/`

---

## 📁 Project Structure

```
chiaramanenti.com/
├── public/
│   ├── index.html              # Main HTML
│   ├── css/
│   │   └── style.css           # All styles (14KB)
│   ├── js/
│   │   └── app.js              # All JavaScript (14KB)
│   └── config.json             # Video IDs configuration
├── server.js                   # Express server (5KB)
├── package.json                # Dependencies
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── README.md                   # Main documentation
└── QUICKSTART.md               # Setup guide
```

---

## 🔧 Configuration

### config.json
```json
{
  "showreel": {
    "videoId": "FBCdo1rn0sY",
    "autoplay": true
  },
  "scoringVideos": [
    { "thumbnail": "caminandes.jpg", "videoId": "PLACEHOLDER_1" },
    { "thumbnail": "kairo-no-tabi.jpg", "videoId": "PLACEHOLDER_2" },
    { "thumbnail": "kgt.jpg", "videoId": "PLACEHOLDER_3" },
    { "thumbnail": "raven-song.jpg", "videoId": "PLACEHOLDER_4" }
  ]
}
```

### Environment Variables (.env)
```bash
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=chiaramanenticontact@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🚀 Deployment Instructions

### 1. Push to GitHub
```bash
cd /mnt/nas/github_munitnam/git/chiaramanenti.com
git remote add origin https://github.com/[owner]/chiaramanenti.com.git
git branch -M main
git push -u origin main
```

### 2. Hostinger Setup
1. **Connect Repository**
   - Link GitHub repo to Hostinger
   - Set branch: `main` (later create `dev` branch)

2. **Build Configuration**
   - Build command: `npm install`
   - Start command: `npm start`
   - Node version: 24.x

3. **Environment Variables**
   Add in Hostinger panel:
   - `PORT` (auto-configured)
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=chiaramanenticontact@gmail.com`
   - `EMAIL_PASS=[app-password]`

4. **Assets Handling**
   **Option A**: Upload to Hostinger
   - Copy `/mnt/nas/.../selection/` to Hostinger public folder
   - Update paths in `server.js`
   
   **Option B**: CDN/Cloud Storage
   - Upload to cloud storage (AWS S3, Cloudinary, etc.)
   - Update asset URLs

---

## ✅ Testing Checklist

### Local Testing (DONE ✅)
- [x] Server starts successfully
- [x] Homepage loads
- [x] API endpoints working (`/api/audio-files`, `/api/carousel-images`)
- [x] Assets loading from NAS
- [x] Bio text loading

### Pre-Deployment Testing (TODO)
- [ ] Test all sections on desktop
- [ ] Test all sections on tablet
- [ ] Test all sections on mobile
- [ ] Test menu navigation
- [ ] Test parallax scrolling
- [ ] Test video modal
- [ ] Test audio player
- [ ] Test contact form (with real email)
- [ ] Test all links
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## 📝 Next Steps

### Phase 1: Deployment (Immediate)
1. Create GitHub repository
2. Push code to GitHub
3. Configure Hostinger
4. Upload/configure assets
5. Set environment variables
6. Deploy to dev environment
7. Test thoroughly
8. Deploy to production

### Phase 2: Content Updates (After Deployment)
1. Update YouTube video IDs in `config.json`
2. Add actual showreel video
3. Test all videos
4. Get email credentials configured
5. Test contact form

### Phase 3: Branch Strategy
1. Create `dev` branch from `main`
2. Set up Hostinger auto-deploy for both branches
3. Dev URL: `dev.chiaramanenti.com` (or subdomain)
4. Main URL: `chiaramanenti.com`

### Phase 4: Back Office (Future)
**Prerequisites**: Database credentials needed
**Features to build**:
- Admin login/authentication
- Content management:
  - Update bio text
  - Upload/manage images
  - Update video IDs
  - Manage audio files
  - Update social links
- User management
- Analytics dashboard

---

## 🎯 Current Status

### ✅ Completed
- [x] Full frontend implementation
- [x] Responsive design
- [x] Parallax effects
- [x] YouTube integration
- [x] Audio player with waveforms
- [x] Contact form backend
- [x] API endpoints
- [x] Configuration system
- [x] Git repository initialized
- [x] Documentation

### ⏳ Pending
- [ ] Push to GitHub
- [ ] Hostinger deployment
- [ ] Email configuration
- [ ] Video ID updates
- [ ] Live testing
- [ ] Mobile device testing
- [ ] Performance optimization
- [ ] SEO metadata

### 🔮 Future (Phase 2)
- [ ] Database integration
- [ ] Back office development
- [ ] Admin panel
- [ ] CMS features

---

## 📊 Performance Notes

### Optimizations Implemented
- Lazy loading for YouTube videos (Intersection Observer)
- CSS transitions for smooth animations
- Minimal JavaScript dependencies
- Efficient asset serving from NAS
- Responsive images

### Recommendations
- Consider image optimization (WebP format)
- Implement lazy loading for images
- Add service worker for PWA
- Compress assets before deployment
- Consider CDN for global delivery

---

## 🆘 Support & Contacts

**Developer**: Julien Muraccioli  
**Artist**: Chiara Manenti  
**Email**: chiaramanenticontact@gmail.com  
**Project Location**: `/mnt/nas/github_munitnam/git/chiaramanenti.com/`

---

## 📚 Additional Resources

- **BookStack Documentation**: http://192.168.0.38:6875/books/chiaramanenticom-portfolio-website
- **GitHub Repo**: [To be created]
- **Hostinger Panel**: [To be configured]

---

**Last Updated**: 2026-01-20 23:13 UTC  
**Version**: 1.0.0  
**Status**: ✅ Frontend Complete - Ready for Deployment
