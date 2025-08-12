# 🚀 Quick Deploy to Render

## One-Click Deployment Links

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/your-username/pacey-school-solution)

## Required Environment Variables

Set these in your Render dashboard:

```bash
# Database (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pacey-school-db?retryWrites=true&w=majority
DATABASE_NAME=pacey-school-db

# App Configuration (Required)
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-123456789

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@paceyschool.com
```

## Demo Credentials (Built-in)

After deployment, test with these accounts:

- **Admin**: `demo@paceyschool.com` / `demo123`
- **Teacher**: `teacher@paceyschool.com` / `teacher123` 
- **Student**: `student@paceyschool.com` / `student123`

## Health Check

Visit `/api/health` to verify deployment status.

---

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
