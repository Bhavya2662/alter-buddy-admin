# Admin Panel - Vercel Deployment Guide

## Overview
This guide will help you deploy the Admin Panel to Vercel with proper configuration for production use.

## Prerequisites
- Vercel account
- GitHub repository with the admin panel code
- Railway API deployed and running

## Step 1: Prepare for Deployment

### 1.1 Environment Variables Setup
The following environment variables need to be configured in Vercel:

```bash
# API Configuration
REACT_APP_API_URL=https://alter-buddy-api-production.up.railway.app/api/1.0
REACT_APP_SOCKET_SERVER=https://alter-buddy-api-production.up.railway.app

# Environment
REACT_APP_ENVIRONMENT=production

# Build Configuration
NODE_OPTIONS=--max_old_space_size=4096
```

### 1.2 Build Settings
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your admin panel repository from GitHub
4. Select the admin panel directory if it's in a monorepo

### 2.2 Configure Build Settings
1. Set Framework Preset to "Create React App"
2. Set Build Command to `npm run build`
3. Set Output Directory to `build`
4. Set Install Command to `npm install`

### 2.3 Add Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all the environment variables listed in Step 1.1
3. Make sure to set them for Production, Preview, and Development environments

### 2.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Verify the deployment URL

## Step 3: Post-Deployment Configuration

### 3.1 Update Railway CORS Settings
Add your Vercel domain to the Railway API CORS configuration:
```bash
# Add to Railway environment variables
CORS_ORIGIN=https://your-admin-panel.vercel.app,http://localhost:3000
```

### 3.2 Test the Deployment
1. Visit your Vercel deployment URL
2. Test admin login functionality
3. Verify API connections
4. Check all admin features
5. Check browser console for errors

## Step 4: Security Considerations

### 4.1 Admin Access Control
- Ensure proper authentication is implemented
- Verify admin user roles and permissions
- Test login/logout functionality
- Check session management

### 4.2 API Security
- Verify JWT token validation
- Check API endpoint protection
- Test unauthorized access prevention

## Step 5: Troubleshooting

### 5.1 Common Issues

**Blank Page**
- Check if all environment variables are set correctly
- Verify the `homepage: "."` setting in package.json
- Check browser console for JavaScript errors

**API Connection Issues**
- Verify Railway API is running
- Check CORS settings on Railway
- Ensure environment variables match Railway deployment

**Authentication Issues**
- Check JWT token configuration
- Verify API authentication endpoints
- Test admin user credentials

**Build Failures**
- Check for TypeScript errors
- Verify all dependencies are properly installed
- Review build logs in Vercel dashboard

### 5.2 Environment Variable Checklist
- [ ] REACT_APP_API_URL
- [ ] REACT_APP_SOCKET_SERVER
- [ ] REACT_APP_ENVIRONMENT
- [ ] NODE_OPTIONS

## Step 6: Admin Panel Features

### 6.1 Core Features to Test
- [ ] User management
- [ ] Mentor management
- [ ] Session monitoring
- [ ] Payment tracking
- [ ] Analytics dashboard
- [ ] Content management

### 6.2 Data Management
- [ ] User data access
- [ ] Mentor profiles
- [ ] Session records
- [ ] Payment history
- [ ] System logs

## Step 7: Automatic Deployments

Vercel will automatically deploy when you push to your main branch. To configure:

1. Go to Project Settings → Git
2. Configure production branch (usually `main` or `master`)
3. Set up preview deployments for other branches

## Step 8: Monitoring and Analytics

### 8.1 Set Up Monitoring
- Configure error tracking
- Set up performance monitoring
- Enable access logs
- Monitor API usage

### 8.2 Analytics
- Track admin user activity
- Monitor system performance
- Set up alerts for critical issues

## Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up staging environment
4. Implement backup procedures
5. Create admin user documentation

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review browser console errors
3. Verify Railway API status
4. Check environment variable configuration
5. Test API endpoints directly

## Security Best Practices

1. **Access Control**
   - Implement proper admin authentication
   - Use strong passwords
   - Enable two-factor authentication if available

2. **Data Protection**
   - Ensure sensitive data is properly encrypted
   - Implement proper session management
   - Regular security audits

3. **API Security**
   - Validate all API requests
   - Implement rate limiting
   - Monitor for suspicious activity