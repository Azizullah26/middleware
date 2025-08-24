# Vercel Deployment Fix

## Issue
The `/test-event` endpoint was returning "The page could not be found" because Vercel wasn't properly recognizing the serverless function.

## Solution
Updated `vercel.json` to use the newer `functions` configuration instead of `builds`.

## Steps to Redeploy:
1. **Push changes to GitHub**
2. **Redeploy on Vercel** (automatic if connected to GitHub)
3. **Set Environment Variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all required variables:
     - `DAHUA_HOST` = your Dahua device IP
     - `DAHUA_PORT` = 80 (or your device port)
     - `DAHUA_USER` = admin username
     - `DAHUA_PASS` = admin password
     - `AZURE_CLIENT_ID` = 206217f2-eb5f-46f5-aa7e-f246c2a97ef5
     - `AZURE_TENANT_ID` = 14a72467-3f25-4572-a535-3d5eddb00cc5
     - `AZURE_CLIENT_SECRET` = 4pT8Q~zhZE_PFKf9nnZCrLNJqqZpYaotFqebTcPu

## Test After Deployment:
\`\`\`bash
# Health check
curl https://elraceroom.vercel.app/health

# Test event
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{"UserID": "12345", "DoorID": "1"}'
\`\`\`

## Expected Response:
- Health endpoint should return system status
- Test event should return calendar operation results
