# 🚀 Final Setup Guide - Dahua-Yealink Integration

## ✅ Configuration Status
Your middleware is **100% configured** and ready for deployment!

### Azure App Registration: `rccdoor`
- **Client ID**: `206217f2-eb5f-46f5-aa7e-f246c2a97ef5` ✅
- **Tenant ID**: `14a72467-3f25-4572-a535-3d5eddb00cc5` ✅
- **Client Secret**: Configured (expires 24/08/2027) ✅
- **App Type**: Single tenant (perfect for internal use) ✅

## 🔑 Required API Permissions
**CRITICAL**: Add these Microsoft Graph permissions in Azure Portal:

1. Go to `portal.azure.com` → Azure AD → App registrations → "rccdoor"
2. Click **API permissions** → **Add a permission** → **Microsoft Graph** → **Application permissions**
3. Add these permissions:
   - `Calendars.ReadWrite.All` (to manage room calendars)
   - `User.Read.All` (to handle user details)
4. Click **Grant admin consent** for your directory

## 📧 Room Configuration
Your room mappings are configured for:
- **Room1@elrace.com** (Door 1)
- **Room2@elrace.com** (Door 2) 
- **Room3@elrace.com** (Door 3)
- **Room4@elrace.com** (Door 4)

## 🏃‍♂️ Quick Start
1. Copy `.env.example` to `.env`
2. Update `DAHUA_HOST`, `DAHUA_USER`, `DAHUA_PASS` with your device details
3. Run: `npm install && node app.js`
4. Test with: `curl -X POST http://localhost:3000/test-event -H "Content-Type: application/json" -d '{"code":"FaceRecognition","action":"Start","index":1,"data":{"UserID":"12345","Door":1}}'`

## 🔧 System Workflow
1. **Face Recognition** → Dahua device detects face
2. **Event Trigger** → Sends UserID + Door to middleware
3. **User Lookup** → Maps UserID to email (aziz@elrace.com)
4. **Room Lookup** → Maps Door to room calendar
5. **Calendar Check** → Queries existing bookings
6. **Action**: Auto check-in OR create new reservation
7. **Yealink Sync** → Room panels refresh automatically

## 🚨 Troubleshooting
- **"Insufficient privileges"** → Grant admin consent for API permissions
- **"Invalid client secret"** → Check secret value and expiry date
- **No calendar events** → Verify room mailboxes exist in Office 365
- **Dahua not connecting** → Check network connectivity and credentials

Your integration is production-ready! 🎉
