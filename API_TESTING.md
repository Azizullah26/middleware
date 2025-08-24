# 🧪 API Testing Guide for Dahua-Yealink Integration

## Available Test Endpoints

### 1. **Health Check** - `GET /health`
\`\`\`bash
curl https://elraceroom.vercel.app/health
\`\`\`
**Returns:** System status, room/user counts, Dahua connection status, environment info

### 2. **Test Face Recognition Event** - `POST /test-event`
\`\`\`bash
# Test with User 12345 (Aziz) accessing Room 1
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FaceRecognition",
    "action": "Start",
    "index": 1,
    "data": {
      "UserID": "12345",
      "Door": 1
    }
  }'

# Test with different user and room
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AccessControl",
    "action": "Start",
    "index": 2,
    "data": {
      "UserID": "67890",
      "Door": 2
    }
  }'
\`\`\`

### 3. **Test Microsoft Graph API** - `GET /test-graph-api`
\`\`\`bash
curl https://elraceroom.vercel.app/test-graph-api
\`\`\`
**Returns:** Calendar events from Room1@elrace.com, tests Azure authentication

### 4. **Preview Mode Info** - `GET /preview`
\`\`\`bash
curl https://elraceroom.vercel.app/preview
\`\`\`
**Returns:** Configuration details, user/room mappings, preview mode status

## Test Scenarios

### Scenario 1: Authorized User Check-in
\`\`\`bash
# Aziz (12345) accessing Room 1 with existing booking
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{"code": "FaceRecognition", "data": {"UserID": "12345", "Door": 1}}'
\`\`\`

### Scenario 2: Walk-in Reservation
\`\`\`bash
# User without existing booking creates new reservation
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{"code": "FaceRecognition", "data": {"UserID": "67890", "Door": 3}}'
\`\`\`

### Scenario 3: Unauthorized Access
\`\`\`bash
# Unknown user ID (should be rejected)
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{"code": "FaceRecognition", "data": {"UserID": "99999", "Door": 1}}'
\`\`\`

## User & Room Mappings

### Users:
- **12345**: aziz@elrace.com (Admin)
- **67890**: user2@elrace.com (Employee)
- **11111**: user3@elrace.com (Employee)
- **22222**: user4@elrace.com (Employee)

### Rooms:
- **Door 1**: Room1@elrace.com (8 capacity)
- **Door 2**: Room2@elrace.com (6 capacity)
- **Door 3**: Room3@elrace.com (4 capacity)
- **Door 4**: Room4@elrace.com (10 capacity)

## Environment Variables for Testing

Set `PREVIEW_MODE=true` to test without making real calendar changes:
\`\`\`bash
# Safe testing mode
PREVIEW_MODE=true

# Production mode (real calendar changes)
PREVIEW_MODE=false
\`\`\`

## Expected Responses

### Success Response:
\`\`\`json
{
  "message": "Event simulated successfully",
  "event": {...},
  "previewMode": true/false
}
\`\`\`

### Error Response:
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
