# HTTPS Setup for Local Development

## Option 1: Using ngrok (Recommended for Testing)

Ngrok creates a secure tunnel to your local development server with HTTPS automatically.

### Steps:
1. Install ngrok: https://ngrok.com/download
2. Start your Next.js app: `npm run dev`
3. In another terminal, run: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update your `.env.local` with the ngrok URL:
   ```
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
   ```
6. Restart your Next.js app

### Pros:
- Easy to set up
- Works with Stripe webhooks
- Can share the URL for testing on other devices
- Real HTTPS certificate

### Cons:
- URL changes every time you restart ngrok (free version)
- Requires internet connection

---

## Option 2: Using mkcert (Local SSL Certificate)

Creates a locally trusted SSL certificate for localhost.

### Steps:
1. Install mkcert:
   ```bash
   # On macOS
   brew install mkcert
   brew install nss # for Firefox support
   
   # On Linux
   sudo apt install libnss3-tools
   wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
   chmod +x mkcert-v1.4.4-linux-amd64
   sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
   ```

2. Create local Certificate Authority:
   ```bash
   mkcert -install
   ```

3. Generate certificate for localhost:
   ```bash
   mkdir -p .cert
   mkcert -key-file .cert/localhost-key.pem -cert-file .cert/localhost.pem localhost 127.0.0.1
   ```

4. Create custom server file `server.js`:
   ```javascript
   const { createServer } = require('https')
   const { parse } = require('url')
   const next = require('next')
   const fs = require('fs')

   const dev = process.env.NODE_ENV !== 'production'
   const app = next({ dev })
   const handle = app.getRequestHandler()

   const httpsOptions = {
     key: fs.readFileSync('./.cert/localhost-key.pem'),
     cert: fs.readFileSync('./.cert/localhost.pem')
   }

   app.prepare().then(() => {
     createServer(httpsOptions, (req, res) => {
       const parsedUrl = parse(req.url, true)
       handle(req, res, parsedUrl)
     }).listen(3000, (err) => {
       if (err) throw err
       console.log('> Ready on https://localhost:3000')
     })
   })
   ```

5. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "dev:https": "node server.js",
       "build": "next build",
       "start": "next start"
     }
   }
   ```

6. Update `.env.local`:
   ```
   NEXT_PUBLIC_APP_URL=https://localhost:3000
   ```

7. Run with HTTPS: `npm run dev:https`

### Pros:
- Works offline
- Consistent URL
- Faster than ngrok

### Cons:
- More complex setup
- Won't work for Stripe webhooks (need ngrok for that)
- Certificate only trusted on your machine

---

## Recommended Workflow

For development with Stripe:
1. Use ngrok for testing payments and webhooks
2. Use regular `npm run dev` for UI development without payments

## Stripe Webhook Setup with ngrok

1. Start ngrok: `ngrok http 3000`
2. Copy the HTTPS URL
3. In Stripe Dashboard → Developers → Webhooks
4. Add endpoint: `https://your-ngrok-url.ngrok.io/api/webhook`
5. Select events: `checkout.session.completed`
6. Copy the webhook signing secret to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
