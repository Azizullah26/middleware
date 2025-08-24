# Dahua-Yealink Integration Middleware

*Face Recognition to Calendar Integration System*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/azizkhan-projects/v0-middleware-code-and-process)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/WjzM1R06BZz)

## Overview

This middleware connects Dahua face recognition devices with Yealink room panels through Microsoft Graph API for seamless calendar management. When users scan their faces at door devices, the system automatically handles check-ins for existing bookings or creates new reservations.

## Features

- **Face Recognition Integration**: Connects to Dahua devices for real-time face recognition events
- **Calendar Management**: Automatic check-ins and reservation creation via Microsoft Graph API
- **Multi-Room Support**: Handles 4 meeting rooms (Room1-4@elrace.com)
- **User Verification**: Validates user permissions before granting access
- **Auto Reservations**: Creates bookings for authorized walk-ins
- **REST API**: Test endpoints for development and debugging

## Quick Start

1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.example` to `.env` and fill in your credentials
3. **Start server**: `npm start`
4. **Run tests**: `npm test`

## Configuration

### Required Environment Variables

\`\`\`env
# Dahua Device
DAHUA_HOST=192.168.1.100
DAHUA_USER=admin
DAHUA_PASS=your_password

# Microsoft Azure
AZURE_CLIENT_ID=your_client_id
AZURE_TENANT_ID=your_tenant_id
AZURE_CLIENT_SECRET=your_client_secret

# Server
PORT=3000
\`\`\`

### Room Mappings

- **Room 1**: Room1@elrace.com
- **Room 2**: Room2@elrace.com  
- **Room 3**: Room3@elrace.com
- **Room 4**: Room4@elrace.com

### User Mappings

- **UserID 12345**: aziz@elrace.com
- **UserID 67890**: user2@elrace.com
- Add more users in `app.js`

## API Endpoints

- `GET /health` - System health check
- `GET /test-graph-api` - Test Microsoft Graph connectivity
- `POST /test-event` - Simulate face recognition events

## Deployment

Your project is live at:
**[https://elraceroom.vercel.app](https://elraceroom.vercel.app)**

## How It Works

1. **Face Recognition**: Dahua device detects face and sends event with UserID
2. **User Lookup**: System maps UserID to email address
3. **Room Identification**: Maps device/door to specific room calendar
4. **Calendar Check**: Queries Microsoft Graph for current bookings
5. **Action Decision**: 
   - If user has booking → Auto check-in
   - If no booking → Create new reservation
   - If unauthorized → Log and deny

## Setup Guide

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete installation instructions.

## Testing

\`\`\`bash
# Start the server
npm start

# Run integration tests
npm test

# Manual test with curl
curl -X POST http://localhost:3000/test-event \
  -H "Content-Type: application/json" \
  -d '{"code":"FaceRecognition","action":"Start","index":1,"data":{"UserID":"12345"}}'
\`\`\`

## Architecture

\`\`\`
Dahua Device → Node.js Middleware → Microsoft Graph API → Office 365 Calendar → Yealink Panel
\`\`\`

## Support

For issues or questions, check the troubleshooting section in [SETUP_GUIDE.md](./SETUP_GUIDE.md).

---

Continue building your app on: **[https://v0.app/chat/projects/WjzM1R06BZz](https://v0.app/chat/projects/WjzM1R06BZz)**
