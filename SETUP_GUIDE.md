# Complete Setup Guide

## Phase 1: Environment Setup (15 minutes)

1. **Install Node.js** (v18+) from [nodejs.org](https://nodejs.org)
2. **Clone/Download** this project
3. **Install dependencies**: `npm install`
4. **Configure environment**: `cp .env.example .env`

## Phase 2: Azure Configuration (20 minutes)

1. **Create Azure App Registration**:
   - Go to [portal.azure.com](https://portal.azure.com)
   - Azure AD → App registrations → New registration
   - Name: "Dahua-Yealink Integration"

2. **Set Permissions**:
   - API permissions → Add permission → Microsoft Graph
   - Application permissions → Add:
     - `Calendars.ReadWrite` (Admin consent: No)
     - `User.Read` (Admin consent: No)
   - Grant admin consent

3. **Create Client Secret**:
   - Certificates & secrets → New client secret
   - Description: "door" 
   - Expires: 24/08/2027
   - Copy the secret value to your .env file

4. **Get IDs**:
   - Copy Client ID and Tenant ID to your .env file

## Phase 3: Office 365 Room Setup (10 minutes)

### Create Room Mailboxes
Ensure these room mailboxes exist in your Office 365 admin center:
- **Room1@elrace.com** - Conference Room 1
- **Room2@elrace.com** - Conference Room 2  
- **Room3@elrace.com** - Conference Room 3
- **Room4@elrace.com** - Conference Room 4

### Configure Room Settings
For each room mailbox:
1. **Resource Settings**: Enable automatic booking, set 180-day booking window
2. **Permissions**: Grant Azure app "Full Access" permissions
3. **Calendar Processing**: Set "AutomateProcessing" to "AutoAccept"

## Phase 4: Dahua Device Configuration (30 minutes)

1. **Enable Face Recognition**:
   - Login to device web UI
   - Setup → AI → Face Recognition → Enable

2. **Add Users to Face Database**:
   - UserID 12345 → Upload photo for aziz@elrace.com
   - UserID 67890 → Upload photo for user2@elrace.com
   - etc.

3. **Configure Network**:
   - Ensure device can reach your middleware server
   - Note device IP for DAHUA_HOST in .env

## Phase 5: Testing (15 minutes)

1. **Start the server**: `npm start`
2. **Test Graph API**: Visit `http://localhost:3000/test-graph-api`
3. **Simulate events**: 
   \`\`\`bash
   curl -X POST http://localhost:3000/test-event \
     -H "Content-Type: application/json" \
     -d '{"index": 1, "data": {"UserID": 12345, "Door": 1}}'
   \`\`\`
4. **Test face recognition**: Scan a face at the Dahua device
5. **Verify calendar**: Check Office 365 for auto check-ins or new reservations

## Phase 6: Deployment

Ready for deployment on:
- **Vercel**: Add environment variables in project settings
- **Heroku**: Use Heroku Config Vars
- **AWS/VPS**: Use PM2 for process management

### Deploy to elraceroom.vercel.app:
1. **Push to GitHub**: Commit all files to your repository
2. **Connect Vercel**: Link your GitHub repo to Vercel
3. **Set Environment Variables** in Vercel project settings:
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID` 
   - `AZURE_CLIENT_SECRET=4pT8Q~zhZE_PFKf9nnZCrLNJqqZpYaotFqebTcPu`
   - `DAHUA_HOST`, `DAHUA_PORT`, `DAHUA_USER`, `DAHUA_PASS`
4. **Deploy**: Vercel will automatically deploy to elraceroom.vercel.app

### Post-Deployment:
- Update Dahua webhook URL to: `https://elraceroom.vercel.app/api/dahua-event`
- Test with: `https://elraceroom.vercel.app/health`

## Troubleshooting

- **"Insufficient privileges"**: Check Azure app permissions
- **"Invalid client secret"**: Regenerate secret in Azure
- **No events detected**: Verify Dahua network connectivity
- **Calendar not updating**: Check room mailbox permissions
