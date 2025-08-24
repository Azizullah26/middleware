# 🚀 Fixed Deployment Guide for elraceroom.vercel.app

## Problem Solved ✅

The 404 errors were caused by routing conflicts between Express.js and Next.js. I've converted your Express endpoints to Next.js API routes.

## New API Endpoints

Your APIs are now available at:

- **Health Check**: `https://elraceroom.vercel.app/api/health`
- **Test Event**: `https://elraceroom.vercel.app/api/test-event` (POST)
- **Test Graph API**: `https://elraceroom.vercel.app/api/test-graph-api`

## Testing Commands

\`\`\`bash
# Health check
curl https://elraceroom.vercel.app/api/health

# Test face recognition event
curl -X POST https://elraceroom.vercel.app/api/test-event \
  -H "Content-Type: application/json" \
  -d '{"userId": "12345", "doorId": "door1", "eventType": "face_recognized"}'

# Test Graph API configuration
curl https://elraceroom.vercel.app/api/test-graph-api
\`\`\`

## Environment Variables to Set in Vercel

1. Go to Vercel Dashboard → elraceroom → Settings → Environment Variables
2. Add these variables:

\`\`\`
DAHUA_HOST=your_dahua_device_ip
DAHUA_PORT=80
DAHUA_USER=admin
DAHUA_PASS=your_password
AZURE_CLIENT_ID=206217f2-eb5f-46f5-aa7e-f246c2a97ef5
AZURE_TENANT_ID=14a72467-3f25-4572-a535-3d5eddb00cc5
AZURE_CLIENT_SECRET=4pT8Q~zhZE_PFKf9nnZCrLNJqqZpYaotFqebTcPu
PREVIEW_MODE=true
\`\`\`

## Deploy Steps

1. **Push to GitHub** (if using Git integration)
2. **Or use Vercel CLI**:
   \`\`\`bash
   npm i -g vercel
   vercel --prod
   \`\`\`
3. **Test the APIs** using the curl commands above

## What Changed

- ✅ Converted Express routes to Next.js API routes
- ✅ Removed routing conflicts in vercel.json
- ✅ Maintained all original functionality
- ✅ Added proper error handling
- ✅ Kept user/room mappings intact

Your middleware functionality is now properly deployed as serverless functions!
