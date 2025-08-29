# Deploy Dahua-Yealink Integration to Vercel

## Step-by-Step Deployment Guide

### 1. Install Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

### 2. Login to Vercel
\`\`\`bash
vercel login
\`\`\`

### 3. Deploy from Project Root
\`\`\`bash
vercel --prod
\`\`\`

### 4. Set Environment Variables in Vercel Dashboard
Go to https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these variables:
\`\`\`
AZURE_CLIENT_ID=206217f2-eb5f-46f5-aa7e-f246c2a97ef5
AZURE_TENANT_ID=14a72467-3f25-4572-a535-3d5eddb00cc5
AZURE_CLIENT_SECRET=4pT8Q~zhZE_PFKf9nnZCrLNJqqZpYaotFqebTcPu
DAHUA_HOST=192.168.1.100
DAHUA_PORT=80
DAHUA_USER=admin
DAHUA_PASS=your_dahua_password
PORT=3000
PREVIEW_MODE=false
\`\`\`

### 5. Test Your Deployed APIs

**Health Check:**
\`\`\`bash
curl https://elraceroom.vercel.app/api/health
\`\`\`

**Test Event:**
\`\`\`bash
curl -X POST https://elraceroom.vercel.app/api/test-event \
  -H "Content-Type: application/json" \
  -d '{
    "UserID": "12345",
    "DoorID": "1",
    "EventType": "FaceRecognition",
    "Timestamp": "2024-01-15T10:30:00Z"
  }'
\`\`\`

**Test Graph API:**
\`\`\`bash
curl https://elraceroom.vercel.app/api/test-graph-api
\`\`\`

### 6. Configure Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `elraceroom.vercel.app` (already configured)
3. Update DNS if using custom domain

### 7. Monitor Deployment
- Check logs: `vercel logs`
- View dashboard: https://vercel.com/dashboard
- Monitor functions: Vercel Dashboard → Functions tab

## Troubleshooting

**Common Issues:**
- **Environment variables not set**: Check Vercel Dashboard → Settings → Environment Variables
- **API 404 errors**: Ensure files are in `/api/` folder with proper export format
- **CORS errors**: Check if frontend domain is whitelisted in API responses
- **Graph API errors**: Verify Azure permissions and credentials

**Quick Fixes:**
\`\`\`bash
# Redeploy after changes
vercel --prod

# Check deployment status
vercel ls

# View recent deployments
vercel inspect [deployment-url]
\`\`\`

## Production Checklist
- [ ] All environment variables set in Vercel
- [ ] Azure app permissions granted (Calendars.ReadWrite, User.Read)
- [ ] Room mailboxes created (Room1-4@elrace.com)
- [ ] Dahua devices configured with webhook URLs
- [ ] API endpoints tested and working
- [ ] Preview mode disabled (`PREVIEW_MODE=false`)

Your Dahua-Yealink integration is now live at: **https://elraceroom.vercel.app**
