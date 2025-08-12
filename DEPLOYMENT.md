# 🚀 Deploying Pacey School Solution to Render

This guide will help you deploy your Pacey School Solution to Render.com.

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **MongoDB Database**: Set up a MongoDB Atlas cluster or similar
3. **Render Account**: Create a free account at [render.com](https://render.com)

## Step-by-Step Deployment Guide

### 1. Prepare Your Database

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist Render's IP addresses (or use 0.0.0.0/0 for development)

#### Option B: Railway MongoDB
1. Go to [Railway](https://railway.app)
2. Create a MongoDB service
3. Get the connection string from the service dashboard

### 2. Deploy to Render

#### Method 1: Using Render Dashboard (Recommended)

1. **Connect GitHub Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository with your Pacey School Solution

2. **Configure the Service**
   - **Name**: `pacey-school-solution`
   - **Environment**: `Node`
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade as needed)

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pacey-school-db
   DATABASE_NAME=pacey-school-db
   NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete (5-10 minutes)

#### Method 2: Using render.yaml (Infrastructure as Code)

1. The `render.yaml` file is already configured in your project
2. Go to Render Dashboard → "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set the required environment variables in the dashboard

### 3. Post-Deployment Steps

1. **Test Your Application**
   - Visit your Render URL (e.g., `https://your-app-name.onrender.com`)
   - Test the login functionality
   - Verify database connectivity at `/api/health`

2. **Initialize Sample Data**
   - Your app includes demo data that will be created automatically
   - Test with demo credentials:
     - Admin: `demo@paceyschool.com` / `demo123`
     - Teacher: `teacher@paceyschool.com` / `teacher123`
     - Student: `student@paceyschool.com` / `student123`

3. **Configure Custom Domain (Optional)**
   - In Render Dashboard → Your Service → Settings
   - Add your custom domain
   - Configure DNS records as instructed

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment | `production` |
| `MONGODB_URI` | Yes | Database connection | `mongodb+srv://...` |
| `DATABASE_NAME` | Yes | Database name | `pacey-school-db` |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app URL | `https://your-app.onrender.com` |
| `JWT_SECRET` | Yes | JWT secret key | `super-secret-key-123` |
| `SMTP_HOST` | No | Email server | `smtp.gmail.com` |
| `SMTP_PORT` | No | Email port | `587` |
| `SMTP_USER` | No | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | No | Email password | `your-app-password` |
| `FROM_EMAIL` | No | From email address | `noreply@paceyschool.com` |

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility (18+)
   - Review build logs in Render dashboard

2. **Database Connection Fails**
   - Verify MongoDB URI is correct
   - Check if IP whitelist includes Render's IPs
   - Test connection locally first

3. **Environment Variables Not Working**
   - Ensure all required variables are set in Render dashboard
   - Check variable names match exactly (case-sensitive)
   - Restart the service after adding variables

4. **App Loads but Features Don't Work**
   - Check browser console for errors
   - Verify API endpoints are working (`/api/health`)
   - Check application logs in Render dashboard

### Performance Tips

1. **Free Tier Limitations**
   - Render free tier sleeps after 15 minutes of inactivity
   - First request after sleep may take 30+ seconds
   - Consider upgrading to paid plan for production use

2. **Optimization**
   - Enable Next.js image optimization
   - Use environment-specific configurations
   - Monitor performance in Render dashboard

## Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

## Security Checklist

- [ ] Use strong, unique JWT secret
- [ ] Set up proper MongoDB authentication
- [ ] Configure environment variables (never commit secrets)
- [ ] Enable HTTPS (automatic with Render)
- [ ] Set up proper CORS headers
- [ ] Regular security updates

---

🎉 **Congratulations!** Your Pacey School Solution should now be live on Render!
