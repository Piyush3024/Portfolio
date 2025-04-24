# Portfolio Website Deployment Guide

This guide explains how to deploy your portfolio website for free without requiring any credit card or payment information.

## Deployment Overview

- **Frontend**: Netlify (Free tier)
- **Backend**: Render (Free tier)
- **Database**: Neon PostgreSQL (Free tier)

## Step 1: Deploy the Database on Neon

1. Sign up for a free account at [Neon](https://neon.tech/) (no credit card required)
2. Create a new project
3. In the Neon dashboard:
   - Go to your project
   - Find your connection string under "Connection Details"
   - Select "Prisma" from the connection string options
   - Copy the connection string
4. Use the Neon SQL Editor to execute the SQL migration script:
   - Copy and paste the contents of `backend/prisma/neon-migration.sql`

## Step 2: Deploy the Backend on Render

1. Sign up for a free account at [Render](https://render.com/) (no credit card required)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Name: portfolio-backend
   - Environment: Node
   - Build Command: `chmod +x render-build.sh && ./render-build.sh`
   - Start Command: `npm start`
   - Plan: Free
5. Add the following environment variables:
   - `DATABASE_URL`: (Your Neon PostgreSQL connection string)
   - `CLIENT_URL`: (Your Netlify frontend URL)
   - `PORT`: 5000
   - `NODE_ENV`: production
   - Add any other environment variables from your `.env` file
6. Deploy the service

## Step 3: Deploy the Frontend on Netlify

1. Sign up for a free account at [Netlify](https://netlify.com/) (no credit card required)
2. From the Netlify dashboard, click "Add new site" > "Import an existing project"
3. Connect to your GitHub repository
4. Configure the build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Add the following environment variable:
   - `VITE_API_URL`: (Your Render backend URL)
6. Deploy the site

## Step 4: Connect Everything

1. Update your frontend's `.env` file with the Render backend URL
2. Update your backend's `.env` file with the Neon PostgreSQL connection string and Netlify frontend URL
3. Redeploy both the frontend and backend if necessary

## Additional Free Services

For any functionality requiring email, you can use:
- [MailerSend](https://www.mailersend.com/) - Offers a free tier with 12,000 emails per month
- [Brevo](https://www.brevo.com/) - Offers a free tier with 300 emails per day

## Limitations of Free Tier Services

- **Render**: The free instance will spin down after 15 minutes of inactivity and take a few seconds to spin up again on the next request
- **Neon**: Free tier includes 10GB storage and reasonable compute limits
- **Netlify**: Limited to 100GB bandwidth per month and 300 build minutes

## Troubleshooting

- If your Render service fails to start, check the logs for errors
- If your frontend can't connect to the backend, ensure CORS is configured correctly
- If you're having database connection issues, check if your Neon connection string is correctly set in the environment variables 