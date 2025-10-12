# Netlify Deployment Guide

This guide covers deploying PAStream to production using Netlify for the frontend and Render for the backend.

## Architecture

- **Frontend (Client)**: Deployed on Netlify
- **Backend (Server)**: Must be deployed on a platform that supports Node.js servers (Render, Railway, Heroku, etc.)

## Step 1: Deploy Backend Server

Since Netlify doesn't support long-running Express servers, deploy your backend first on one of these platforms:

### Option A: Render (Recommended)
1. Go to https://render.com and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `MONGO_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-jwt-secret`
   - `STREAM_API_KEY=your-stream-api-key`
   - `STREAM_API_SECRET=your-stream-api-secret`
   - `TWILIO_ACCOUNT_SID=your-twilio-sid`
   - `TWILIO_AUTH_TOKEN=your-twilio-token`
   - `TWILIO_PHONE_NUMBER=your-twilio-phone`
   - `CLIENT_URL=your-netlify-url` (add this after deploying frontend)
6. Click "Create Web Service"
7. **Save your backend URL** (e.g., `https://your-app.onrender.com`)

### Option B: Railway
1. Go to https://railway.app
2. Create new project from GitHub repo
3. Set root directory to `server`
4. Add the same environment variables as above
5. Deploy and save your backend URL

## Step 2: Deploy Frontend on Netlify

### Via Netlify UI (Recommended)

1. Go to https://netlify.com and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Configure build settings (should auto-detect from netlify.toml):
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
6. Add environment variables:
   - `VITE_API_URL`: Your backend URL from Step 1 (e.g., `https://your-app.onrender.com/v1/api`)
7. Click "Deploy site"

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project root
netlify deploy --prod
```

When prompted:
- Choose "Create & configure a new site"
- Select your team
- Site name: your-app-name
- Publish directory: `client/dist`

## Step 3: Update Backend CORS

After deploying the frontend, update your backend's `CLIENT_URL` environment variable:

1. Go to your backend hosting platform (Render/Railway)
2. Update `CLIENT_URL` to your Netlify URL (e.g., `https://your-app.netlify.app`)
3. Redeploy if necessary

## Step 4: Configure Custom Domain (Optional)

### On Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

### Update Backend:
- Update `CLIENT_URL` environment variable to your custom domain

## Environment Variables Summary

### Backend (Render/Railway)
```
NODE_ENV=production
PORT=3000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret-min-32-chars
STREAM_API_KEY=your-stream-key
STREAM_API_SECRET=your-stream-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
CLIENT_URL=https://your-app.netlify.app
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend.onrender.com/v1/api
```

## Troubleshooting

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct in Netlify environment variables
- Check backend CORS settings include your Netlify URL
- Rebuild frontend after updating environment variables

### Backend CORS errors
- Ensure `CLIENT_URL` in backend matches your Netlify URL exactly
- Check that backend's CORS configuration allows credentials

### Build fails on Netlify
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (set in netlify.toml)

## Continuous Deployment

Both Netlify and Render/Railway support automatic deployments:
- Push to your main branch to trigger automatic deployments
- Frontend and backend will deploy independently

## Monitoring

- **Netlify**: Monitor builds and deployments in Netlify dashboard
- **Render**: Check logs and metrics in Render dashboard
- **Database**: Monitor MongoDB Atlas metrics

## Cost Estimates

- **Netlify**: Free tier includes 100GB bandwidth
- **Render**: Free tier available (spins down after inactivity)
- **MongoDB Atlas**: Free tier includes 512MB storage
- **Stream & Twilio**: Pay-as-you-go (check their pricing)
