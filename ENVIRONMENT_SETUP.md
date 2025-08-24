# Environment Variables Setup Guide

## Required Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Dahua Device Configuration
\`\`\`bash
DAHUA_HOST=192.168.1.100        # Your Dahua device IP address
DAHUA_PORT=80                   # Dahua device HTTP port (usually 80)
DAHUA_USER=admin                # Dahua device admin username
DAHUA_PASS=your_device_password # Dahua device admin password
\`\`\`

### Microsoft Azure Configuration
\`\`\`bash
AZURE_CLIENT_ID=your_client_id_here                    # From Azure App Registration
AZURE_TENANT_ID=your_tenant_id_here                    # From Azure App Registration  
AZURE_CLIENT_SECRET=4pT8Q~zhZE_PFKf9nnZCrLNJqqZpYaotFqebTcPu # Already configured (expires 24/08/2027)
\`\`\`

### Server Configuration
\`\`\`bash
PORT=3000                       # Server port (3000 for development, auto for Vercel)
\`\`\`

### Optional: MongoDB Configuration
\`\`\`bash
MONGODB_URI=mongodb://localhost:27017/dahua-integration # For production user/room mappings
\`\`\`

## Setup Steps

1. **Copy environment file:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. **Fill in your specific values:**
   - Get AZURE_CLIENT_ID and AZURE_TENANT_ID from your Azure App Registration
   - Configure your Dahua device IP and credentials
   - AZURE_CLIENT_SECRET is already configured

3. **Run database setup (if using MongoDB):**
   \`\`\`bash
   node scripts/setup-database.js
   \`\`\`

4. **Test configuration:**
   \`\`\`bash
   npm run dev
   curl http://localhost:3000/health
   \`\`\`

## Verification Checklist

- [ ] Dahua device is accessible at configured IP
- [ ] Azure credentials are valid (test with /test-graph-api endpoint)
- [ ] Room mailboxes exist in Office 365
- [ ] MongoDB connection works (if configured)
- [ ] Server starts without errors
