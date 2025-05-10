# Deployment Guide

This document outlines how to deploy this e-commerce application to production environments. The project uses Vercel for the frontend and Render for the backend.

## Frontend Deployment (Vercel)

1. **Push your code to GitHub**
   Make sure your code is in a GitHub repository.

2. **Sign up for Vercel**
   Go to [Vercel](https://vercel.com) and sign up or log in.

3. **Import the Project**
   - Click "Add New..." and select "Project" from the dropdown menu
   - Connect your GitHub account and select your repository
   - Select the "client" directory as your root directory
   - Configure the project:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Environment Variables**
   Add the following environment variables:
   - `VITE_API_BASE_URL`: `https://carrier-ecommerce.onrender.com`
   - `VITE_API_ENDPOINT`: `/api`
   - `VITE_IMAGE_BASE_URL`: `https://carrier-ecommerce.onrender.com`
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

5. **Deploy**
   Click "Deploy" and wait for the deployment to complete.

## Backend Deployment (Render)

1. **Sign up for Render**
   Go to [Render](https://render.com) and sign up or log in.

2. **Create a new Web Service**
   - Click "New" and select "Web Service"
   - Connect your GitHub account and select your repository
   - Select the "server" directory as your root directory
   - Configure the service:
     - Name: `carrier-ecommerce`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Region: Choose the region closest to your target audience
     - Plan: Free (or select another plan based on your needs)

3. **Environment Variables**
   Add the following environment variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `FRONTEND_URL`: `https://carrier-ecommerce.vercel.app`

4. **Deploy**
   Click "Create Web Service" and wait for the deployment to complete.

## Post-Deployment Steps

1. **Update Stripe Webhook**
   Update your Stripe webhook endpoint to point to your new backend URL:
   `https://carrier-ecommerce.onrender.com/api/payments/webhook`

2. **Test the Application**
   Thoroughly test all features of your application to ensure everything works correctly.

3. **Monitor Performance**
   Use Vercel and Render's monitoring tools to track your application's performance.

## Troubleshooting

- **CORS Issues**: Verify that the CORS configuration allows requests from your frontend domain.
- **Database Connection**: Ensure your MongoDB connection string is correct and accessible from Render.
- **Environment Variables**: Double-check all environment variables on both Vercel and Render.
- **Logs**: Check logs on both platforms for any errors.

## Maintenance

- Regularly update your dependencies
- Monitor usage patterns and scale resources as needed
- Implement a logging solution for better error tracking 