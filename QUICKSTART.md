# Quick Start Guide - Render Deployment

## Fast Track Deployment (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Set Up External Services

**MongoDB Atlas** (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster → Create database user
3. Network Access → Add IP: `0.0.0.0/0`
4. Copy connection string

**Stream Chat API** (1 minute)
1. Go to https://getstream.io
2. Sign up → Create app
3. Copy API Key and Secret

**Twilio** (Optional - for video)
1. Go to https://www.twilio.com
2. Get Account SID, Auth Token, Phone Number

### 3. Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Environment**: Docker
   - **Branch**: main
   - **Plan**: Free

5. Add Environment Variables:
```
NODE_ENV=production
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<random-32-char-string>
STREAM_API_KEY=<stream-key>
STREAM_API_SECRET=<stream-secret>
TWILIO_ACCOUNT_SID=<twilio-sid>
TWILIO_AUTH_TOKEN=<twilio-token>
TWILIO_PHONE_NUMBER=<twilio-number>
```

6. Click "Create Web Service"

7. After deployment, add:
```
CLIENT_URL=https://<your-app>.onrender.com
```

### 4. Enable CI/CD (Optional)

1. Render Dashboard → Your Service → Settings
2. Copy "Deploy Hook URL"
3. GitHub Repository → Settings → Secrets
4. Add secret: `RENDER_DEPLOY_HOOK_URL`

Done! Every push to main auto-deploys.

## Local Testing with Docker

```bash
# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up --build
```

Visit: http://localhost:3000

## Generate JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Common Issues

**Build fails**: Check Render logs for errors
**CORS errors**: Verify CLIENT_URL matches your Render URL
**Database connection**: Ensure MongoDB IP whitelist includes 0.0.0.0/0

## Next Steps

- Review full guide: `DEPLOYMENT.md`
- Configure custom domain in Render
- Set up monitoring and alerts
- Upgrade to paid plan for production
