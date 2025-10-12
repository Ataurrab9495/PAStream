# Quick Deployment Checklist

## Prerequisites
- [ ] MongoDB Atlas account with connection string
- [ ] Stream Chat API credentials (https://getstream.io)
- [ ] Twilio account credentials (https://www.twilio.com)
- [ ] GitHub repository for your code

## Step 1: Deploy Backend (5 minutes)

**Using Render.com:**

1. Visit https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add these environment variables:
   ```
   NODE_ENV=production
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<random-32-char-string>
   STREAM_API_KEY=<your-stream-key>
   STREAM_API_SECRET=<your-stream-secret>
   TWILIO_ACCOUNT_SID=<your-twilio-sid>
   TWILIO_AUTH_TOKEN=<your-twilio-token>
   TWILIO_PHONE_NUMBER=<your-twilio-phone>
   CLIENT_URL=<leave-blank-for-now>
   ```
6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., https://your-app.onrender.com)

## Step 2: Deploy Frontend (3 minutes)

**Using Netlify:**

1. Visit https://netlify.com and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Build settings should auto-detect:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
5. Add environment variable:
   ```
   VITE_API_URL=<your-backend-url>/v1/api
   ```
   Example: `https://your-app.onrender.com/v1/api`
6. Click "Deploy site"
7. **Copy your frontend URL** (e.g., https://your-app.netlify.app)

## Step 3: Update Backend CORS (1 minute)

1. Go back to Render.com
2. Open your backend service
3. Go to "Environment" tab
4. Update `CLIENT_URL` to your Netlify URL
5. Save changes (backend will redeploy)

## Done!

Visit your Netlify URL to see your deployed app!

## Troubleshooting

**Can't connect to backend?**
- Verify VITE_API_URL in Netlify includes `/v1/api` at the end
- Check backend logs on Render for errors

**CORS errors?**
- Ensure CLIENT_URL in backend matches Netlify URL exactly
- Wait for backend redeploy after updating CLIENT_URL

**Build fails?**
- Check build logs for specific error messages
- Ensure all environment variables are set correctly
