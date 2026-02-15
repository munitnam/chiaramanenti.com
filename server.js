require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve assets - these are now in public/assets
// No need for separate static routes since express.static('public') handles it all

// API: Get carousel images
app.get('/api/carousel-images', async (req, res) => {
    try {
        const carouselPath = path.join(__dirname, 'public/assets/images/scoring_carousel');
        const files = await fs.readdir(carouselPath);
        const imageFiles = files.filter(file => 
            file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );
        
        const images = imageFiles.map((file, index) => ({
            filename: file,
            videoId: `VIDEO_ID_${index + 1}` // Placeholder, to be updated later
        }));
        
        res.json(images);
    } catch (error) {
        console.error('Error reading carousel images:', error);
        res.status(500).json({ error: 'Failed to load carousel images' });
    }
});

// API: Get audio files
app.get('/api/audio-files', async (req, res) => {
    try {
        const audioPath = path.join(__dirname, 'public/assets/audio');
        const files = await fs.readdir(audioPath);
        const audioFiles = files.filter(file => file.endsWith('.mp3'));
        
        // Custom title mapping
        const titleMap = {
            'Dune-on-Guitar.mp3': 'Dune',
            'Strange-Deja-vu-cover-v7.mp3': 'Cover - Strange Déjà Vu (Dream Theater)'
        };
        
        const tracks = audioFiles.map((file, index) => ({
            title: titleMap[file] || file.replace('.mp3', '').replace(/_/g, ' '),
            filename: file
        }));
        
        res.json(tracks);
    } catch (error) {
        console.error('Error reading audio files:', error);
        res.status(500).json({ error: 'Failed to load audio files' });
    }
});

// API: Contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, turnstileToken } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!turnstileToken) {
        return res.status(400).json({ error: 'Verification challenge required' });
    }

    try {
        // Verify Cloudflare Turnstile token
        const turnstileVerify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: turnstileToken
            })
        });

        const turnstileResult = await turnstileVerify.json();

        if (!turnstileResult.success) {
            return res.status(400).json({ error: 'Verification failed. Please try again.' });
        }

        // Configure nodemailer transporter - Hostinger SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'julienmuraccioli@gmail.com',
            subject: `[chiaramanenti.com] ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
            replyTo: email
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🎵 Chiara Manenti Portfolio Website                   ║
║                                                          ║
║   Server running on: http://localhost:${PORT}            ║
║                                                          ║
║   Ready to showcase amazing music and guitar work! 🎸   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
