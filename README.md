# Chiara Manenti - Portfolio Website

🎵 Official portfolio website for Chiara Manenti - Film Composer & Session Guitarist

## Features

- **Responsive Single-Page Design** - Smooth scrolling with parallax effects
- **Showreel Section** - Auto-playing YouTube video integration
- **Scoring Portfolio** - Interactive carousel with video thumbnails
- **Session Guitar** - Custom audio player with waveform visualization
- **About Section** - Bio, logos, and endorsements
- **Contact Form** - Direct email integration
- **Mobile Optimized** - Full responsive design for all devices

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Email**: Nodemailer
- **Assets**: Served from NAS storage

## Installation

1. Clone the repository:
```bash
git clone https://github.com/[owner]/chiaramanenti.com.git
cd chiaramanenti.com
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your email credentials
```

4. Start the server:
```bash
npm start
```

5. Open your browser:
```
http://localhost:3000
```

## Email Configuration

For the contact form to work, you need to configure email settings in `.env`:

1. Use Gmail (or another service)
2. Enable 2-factor authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Add credentials to `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

## Directory Structure

```
chiaramanenti.com/
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Styles with parallax effects
│   └── js/
│       └── app.js          # Interactive features
├── server.js               # Express server
├── package.json
├── .env.example
└── README.md
```

## Assets Location

Assets are served from: `/mnt/nas/github_munitnam/sites/chiaramanenti.com/`

- Images: `selection/`
- Fonts: `fonts/`
- Audio: `selection/audio/`
- Bio: `selection/bio_en.txt`

## Deployment

This website is designed to work with Hostinger auto-deploy:

1. Push to GitHub repository
2. Connect Hostinger to the repository
3. Configure build/deploy settings
4. Set environment variables in Hostinger panel

## Future Enhancements

- [ ] Add database integration for back-office
- [ ] Implement admin panel for content management
- [ ] Add more parallax effects
- [ ] Integrate analytics
- [ ] Add multi-language support (EN/FR)

## Credits

- **Artist**: Chiara Manenti
- **Photography**: Michel Roux
- **Website Development**: Julien Muraccioli

## License

All rights reserved © 2026
