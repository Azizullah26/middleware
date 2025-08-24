# 🚀 Dahua-Yealink Integration Deployment Guide

## Step-by-Step Deployment to elraceroom.vercel.app

### Phase 1: Pre-Deployment Setup (10 minutes)

1. **Verify Environment Variables**
   \`\`\`bash
   # Copy .env.example to .env and fill in values:
   AZURE_CLIENT_ID=206217f2-eb5f-46f5-aa7e-f246c2a97ef5
   AZURE_TENANT_ID=14a72467-3f25-4572-a535-3d5eddb00cc5
   AZURE_CLIENT_SECRET=4pT8Q~zhZE_PFKf9nnZCrLNJqqZpYaotFqebTcPu
   DAHUA_HOST=192.168.1.100
   DAHUA_PORT=80
   DAHUA_USER=admin
   DAHUA_PASS=your_password
   PORT=3000
   PREVIEW_MODE=true
   \`\`\`

2. **Test Locally**
   \`\`\`bash
   npm install
   npm run dev
   # Visit http://localhost:3000 to test dashboard
   # Visit http://localhost:3000/preview to test events
   \`\`\`

### Phase 2: Vercel Deployment (5 minutes)

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Deploy to Vercel**
   \`\`\`bash
   vercel --prod
   # Follow prompts to link to elraceroom.vercel.app
   \`\`\`

3. **Set Environment Variables in Vercel**
   \`\`\`bash
   vercel env add AZURE_CLIENT_ID
   vercel env add AZURE_TENANT_ID  
   vercel env add AZURE_CLIENT_SECRET
   vercel env add DAHUA_HOST
   vercel env add DAHUA_PORT
   vercel env add DAHUA_USER
   vercel env add DAHUA_PASS
   vercel env add PREVIEW_MODE
   \`\`\`

### Phase 3: Azure Configuration (15 minutes)

1. **Update Redirect URIs in Azure**
   - Go to Azure Portal → App Registrations → rccdoor
   - Add redirect URI: `https://elraceroom.vercel.app`

2. **Verify Permissions**
   - Ensure `Calendars.ReadWrite` and `User.Read` are granted
   - Admin consent should be "Yes" for both

### Phase 4: Dahua Device Configuration (20 minutes)

1. **Network Setup**
   - Ensure Dahua device can reach `https://elraceroom.vercel.app`
   - Configure webhook URL: `https://elraceroom.vercel.app/api/dahua-event`

2. **Face Database**
   - Add users with specific UserIDs (12345, 67890, etc.)
   - Test face recognition triggers events

### Phase 5: Testing & Verification (10 minutes)

1. **Test Dashboard**
   - Visit `https://elraceroom.vercel.app`
   - Verify system status shows "Running"
   - Test Microsoft Graph API connection

2. **Test Preview Mode**
   - Visit `https://elraceroom.vercel.app/preview`
   - Send test events and verify responses
   - Check error monitoring works

3. **Test Real Events**
   - Set `PREVIEW_MODE=false` in Vercel
   - Test actual face recognition → calendar booking flow

### Phase 6: Production Monitoring

1. **Monitor Vercel Functions**
   - Check function logs in Vercel dashboard
   - Set up alerts for errors

2. **Monitor Calendar Integration**
   - Verify events appear in Office 365 calendars
   - Test Yealink panel updates

## 🔧 Troubleshooting

- **"Insufficient privileges"** → Check Azure permissions and admin consent
- **"Device unreachable"** → Verify Dahua network configuration
- **"Calendar not found"** → Ensure room mailboxes exist in Office 365
- **Function timeout** → Check Vercel function logs for performance issues

## 📱 Quick Access URLs

- **Main Dashboard**: https://elraceroom.vercel.app
- **Preview/Testing**: https://elraceroom.vercel.app/preview
- **Health Check**: https://elraceroom.vercel.app/health
- **Vercel Dashboard**: https://vercel.com/dashboard

Your integration is now live and ready for production use! 🎉
