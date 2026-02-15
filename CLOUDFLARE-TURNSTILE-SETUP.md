# Cloudflare Turnstile Setup Guide

## What is Cloudflare Turnstile?
Turnstile is Cloudflare's privacy-friendly alternative to CAPTCHA. It protects your contact form from spam bots without annoying your users with image selection puzzles.

## Step 1: Get Turnstile Keys from Cloudflare

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Select your account

2. **Access Turnstile**
   - In the left sidebar, click "Turnstile"
   - Or go directly to: https://dash.cloudflare.com/?to=/:account/turnstile

3. **Create a New Site**
   - Click "Add Site" button
   - **Domain:** Enter `chiaramanenti.com`
   - **Widget Mode:** Choose "Managed" (recommended - invisible for most users)
   - Click "Create"

4. **Get Your Keys**
   You'll receive two keys:
   - **Site Key** (public) - Goes in HTML
   - **Secret Key** (private) - Goes in .env file

## Step 2: Update HTML with Site Key

**File:** `public/index.html`

Find this line (around line 202):
```html
<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY_HERE" data-theme="dark"></div>
```

Replace `YOUR_SITE_KEY_HERE` with your actual Site Key:
```html
<div class="cf-turnstile" data-sitekey="0x4AAA..." data-theme="dark"></div>
```

## Step 3: Update .env File on Server

**File:** `.env` (on Hostinger server)

Add these two lines:
```env
TURNSTILE_SITE_KEY=0x4AAA...  (your site key)
TURNSTILE_SECRET_KEY=0x4AAA...  (your secret key)
```

Your complete .env should look like:
```env
# Server Configuration
PORT=3000

# Email Configuration (for contact form) - Hostinger SMTP
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=contact@chiaramanenti.com
EMAIL_PASS=8BoWP7#@KJk88gt

# Cloudflare Turnstile (for spam protection)
TURNSTILE_SITE_KEY=0x4AAA...
TURNSTILE_SECRET_KEY=0x4AAA...
```

## Step 4: Deploy and Restart

1. **Deploy updated code** to Hostinger (pull from GitHub)
2. **Update .env file** on server with Turnstile keys
3. **Restart Node.js server** 

## Step 5: Test

1. Go to your website contact form
2. Fill in all fields
3. You should see a Cloudflare Turnstile widget appear
4. Submit the form
5. Check that email is received

## How It Works

### User Experience:
- **Invisible mode:** Most legitimate users won't see anything
- **Challenge mode:** Suspicious traffic gets a simple checkbox
- **Dark theme:** Matches your website design

### Protection:
- ✅ Blocks spam bots automatically
- ✅ Analyzes browser fingerprints
- ✅ Checks behavioral patterns
- ✅ Privacy-friendly (GDPR compliant)
- ✅ Free for unlimited verifications

### Technical Flow:
1. User fills contact form
2. Turnstile widget validates in background
3. JavaScript gets token from Turnstile
4. Token sent to server with form data
5. Server verifies token with Cloudflare API
6. Only valid tokens → email sent

## Troubleshooting

### Widget doesn't appear:
- Check console for errors (F12 in browser)
- Verify Site Key is correct in HTML
- Check Turnstile script is loaded

### Form submission fails:
- Verify Secret Key is in .env
- Check server logs for errors
- Ensure Cloudflare API can be reached

### "Verification failed" error:
- Secret Key might be wrong
- Token might be expired (user waited too long)
- Network issue reaching Cloudflare

## Additional Security (Optional)

### Rate Limiting:
Add to Cloudflare dashboard → Security → Rate Limiting:
- Rule: Block more than 5 form submissions per minute from same IP

### Bot Fight Mode:
Enable in Cloudflare dashboard → Security → Bots

### Email Obfuscation:
Already implemented! Emails are Base64 encoded in JavaScript.

## Support

- **Cloudflare Docs:** https://developers.cloudflare.com/turnstile/
- **Turnstile Dashboard:** https://dash.cloudflare.com/?to=/:account/turnstile
