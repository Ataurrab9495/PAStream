# Deployment Guide - Render with Docker & CI/CD

## Prerequisites

1. GitHub account with your code repository
2. Render account (sign up at https://render.com)
3. MongoDB database (MongoDB Atlas recommended)
4. Stream API credentials (for chat functionality)
5. Twilio credentials (for video calling)

## Project Structure

The project is configured for Docker deployment with:
- Multi-stage Dockerfile for optimized builds
- GitHub Actions CI/CD pipeline
- Render deployment configuration

## Step 1: Prepare Your Repository

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit with Docker and CI/CD setup"
```

2. Push to GitHub:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB Database

1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string (replace `<password>` with your actual password)

## Step 3: Get API Credentials

### Stream Chat API
1. Go to https://getstream.io
2. Create an account and project
3. Get your API Key and API Secret

### Twilio (for video calling)
1. Go to https://www.twilio.com
2. Create an account
3. Get your Account SID, Auth Token, and Phone Number

## Step 4: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. Log in to Render (https://dashboard.render.com)

2. Click "New +" and select "Web Service"

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: chat-app (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Environment**: Docker
   - **Plan**: Free (or your preferred plan)

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=3000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-a-random-string>
   STREAM_API_KEY=<your-stream-api-key>
   STREAM_API_SECRET=<your-stream-api-secret>
   TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
   TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
   TWILIO_PHONE_NUMBER=<your-twilio-phone-number>
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   CLIENT_URL=<will-be-your-render-url>
   ```

6. Click "Create Web Service"

7. After deployment, update the `CLIENT_URL` environment variable with your Render URL:
   - Go to "Environment" tab
   - Update CLIENT_URL to: `https://<your-app-name>.onrender.com`
   - Save and redeploy

### Option B: Using render.yaml (Infrastructure as Code)

1. The `render.yaml` file is already configured in your project

2. Go to Render Dashboard → "New +" → "Blueprint"

3. Connect your repository

4. Render will detect the `render.yaml` file automatically

5. Add your environment variables through the Render dashboard

6. Click "Apply" to deploy

## Step 5: Set Up CI/CD with GitHub Actions

The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`

### Enable Automatic Deployments

1. In Render Dashboard, go to your service

2. Go to "Settings" tab

3. Scroll to "Deploy Hook" section

4. Copy the Deploy Hook URL

5. In your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: Paste the deploy hook URL
   - Click "Add secret"

Now every push to `main` branch will:
1. Run tests and build checks
2. Build Docker image
3. Trigger Render deployment automatically

## Step 6: Verify Deployment

1. Wait for the build to complete (check Render logs)

2. Once deployed, visit your app URL: `https://<your-app-name>.onrender.com`

3. Check the logs in Render Dashboard if there are any issues

## Testing Locally with Docker

Before deploying, you can test the Docker setup locally:

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

Or manually:

```bash
# Build
docker build -t chat-app .

# Run with environment variables
docker run -p 3000:3000 \
  -e MONGO_URI=<your-mongo-uri> \
  -e JWT_SECRET=<your-jwt-secret> \
  -e STREAM_API_KEY=<your-stream-key> \
  -e STREAM_API_SECRET=<your-stream-secret> \
  chat-app
```

## Troubleshooting

### Build Failures

1. Check Render logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection string is correct and IP is whitelisted

### Application Errors

1. Check Render logs: Dashboard → Your Service → Logs
2. Verify all API keys and secrets are correct
3. Check MongoDB Atlas for connection issues

### CORS Issues

The server is configured to accept requests from the production domain. If you face CORS issues:
1. Verify CLIENT_URL environment variable is set correctly
2. Check that your frontend is making requests to the correct backend URL

### GitHub Actions Failures

1. Check the Actions tab in your GitHub repository
2. Review the workflow logs
3. Ensure RENDER_DEPLOY_HOOK_URL secret is set correctly

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | Server port | 3000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT tokens | random-string-min-32-chars |
| STREAM_API_KEY | Stream chat API key | From Stream dashboard |
| STREAM_API_SECRET | Stream chat API secret | From Stream dashboard |
| TWILIO_ACCOUNT_SID | Twilio account SID | From Twilio console |
| TWILIO_AUTH_TOKEN | Twilio auth token | From Twilio console |
| TWILIO_PHONE_NUMBER | Twilio phone number | +1234567890 |
| CLIENT_URL | Frontend URL | https://your-app.onrender.com |

## Continuous Deployment Workflow

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. GitHub Actions automatically runs tests and builds
4. On success, triggers Render deployment
5. Render builds Docker image and deploys
6. Your app is live with the latest changes

## Scaling Considerations

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds

### Upgrading to Paid Plans
- For production apps, consider upgrading to paid plans
- Paid plans keep your service always running
- Better performance and no cold starts

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

## Support

If you encounter issues:
1. Check Render logs
2. Review GitHub Actions workflow logs
3. Verify all environment variables
4. Check MongoDB Atlas network access settings
