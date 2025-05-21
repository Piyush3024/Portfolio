# Railway Deployment Guide for Full Stack Portfolio

This guide provides step-by-step instructions for deploying your full stack portfolio application on Railway.

## Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app/))
- Your code pushed to GitHub repositories

## Step 1: Set Up Your Railway Project

1. Log in to Railway using your GitHub account
2. Create a new project by clicking "New Project"
3. Select "Deploy from GitHub repo"
4. Configure GitHub access if prompted

## Step 2: Deploy PostgreSQL Database

1. In your project, click "New" > "Database" > "PostgreSQL"
2. Wait for the database to be provisioned (this might take a minute)
3. Once created, click on the database service
4. Go to "Connect" tab and copy the PostgreSQL connection string
   - It should look like: `postgresql://postgres:password@containers-us-west-XXX.railway.app:PORT/railway`

## Step 3: Deploy Backend Service

1. In your project, click "New" > "GitHub Repo"
2. Select your backend repository
3. Configure the build settings:
   - Railway will automatically detect it's a Node.js application

4. Add the following environment variables by clicking "Variables":
   - `DATABASE_URL`: Paste the PostgreSQL connection string from Step 2
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CLIENT_URL`: `https://your-frontend-domain.up.railway.app` (update this later)
   - `ACCESS_TOKEN_SECRET`: Generate a random string (e.g., `openssl rand -hex 32`)
   - `REFRESH_TOKEN_SECRET`: Generate a random string (e.g., `openssl rand -hex 32`)
   - `SETUP_DB`: `true` (temporary, to initialize the database)

5. Wait for the deployment to complete
6. After successful deployment, set `SETUP_DB` to `false`

## Step 4: Deploy Frontend Service

1. In your project, click "New" > "GitHub Repo"
2. Select your frontend repository
3. Add these environment variables:
   - `VITE_API_URL`: `https://your-backend-domain.up.railway.app/api`

4. Wait for the deployment to complete

## Step 5: Update Environment Variables with Railway Domains

1. After both deployments are complete, get the generated domains for each service
2. Update environment variables:
   - In your backend service:
     - `CLIENT_URL`: `https://your-frontend-domain.up.railway.app`
   - In your frontend service:
     - `VITE_API_URL`: `https://your-backend-domain.up.railway.app/api`

## Step 6: Set Up Custom Domains (Optional)

1. For each service (frontend/backend):
   - Go to "Settings" > "Custom Domain"
   - Click "Generate Domain"
   - Click "Add Custom Domain"
   - Enter your domain

2. Configure your DNS provider with the CNAME records as instructed by Railway

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check your DATABASE_URL environment variable
2. Make sure Prisma schema uses the correct database provider
3. Verify that the database is running correctly in Railway

### Redis Connection Issues

By default, this application is configured to work without Redis. If you want to use Redis:

1. Add a Redis service: In your project, click "New" > "Database" > "Redis"
2. Configure the backend with the Redis URL:
   - Add the Redis connection string as `UPSTACH_REDIS_URL` environment variable

### Deployment Failures

If deployments fail:

1. Check the deployment logs in Railway dashboard
2. Make sure your code works locally
3. Verify your environment variables are set correctly

## Managing Costs

Railway's free tier provides $5 of usage credits per month. To keep costs under control:

1. Use the Railway dashboard to monitor usage
2. Set spending limits in your account settings
3. Remove unnecessary services when not in use

## Maintenance

To update your application:

1. Push changes to your GitHub repository
2. Railway will automatically redeploy your application

## Security Notes

For production deployments:

1. Use strong, randomly generated secrets for JWT tokens
2. Never expose your DATABASE_URL or other secrets
3. Enable Railway's security features like IP allowlisting if needed 