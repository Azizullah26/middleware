# Room Mailbox Setup Guide

## Office 365 Configuration

### Step 1: Create Room Mailboxes
You need to create these 4 room mailboxes in your Office 365 admin center:

- **Room1@elrace.com** - Conference Room 1
- **Room2@elrace.com** - Conference Room 2  
- **Room3@elrace.com** - Conference Room 3
- **Room4@elrace.com** - Conference Room 4

### Step 2: Room Mailbox Settings
For each room mailbox, configure:

1. **Resource Settings:**
   - Enable automatic booking
   - Set booking window (recommend 180 days)
   - Allow recurring meetings
   - Set maximum meeting duration (8 hours recommended)

2. **Permissions:**
   - Grant your Azure app "Full Access" permissions
   - Add room delegates if needed for manual management

3. **Calendar Processing:**
   - Enable "AutomateProcessing" to "AutoAccept"
   - Set "AllowRecurringMeetings" to True
   - Configure "BookingWindowInDays" to 180

### Step 3: Yealink Panel Configuration
Connect each Yealink room panel to its corresponding mailbox:

- **Panel 1** → Room1@elrace.com
- **Panel 2** → Room2@elrace.com
- **Panel 3** → Room3@elrace.com
- **Panel 4** → Room4@elrace.com

### Step 4: Network Mapping
Ensure your Dahua devices map to the correct rooms:

\`\`\`javascript
// Current room mapping in middleware
const roomMap = {
  1: "Room1@elrace.com", // Dahua Door/Index 1
  2: "Room2@elrace.com", // Dahua Door/Index 2
  3: "Room3@elrace.com", // Dahua Door/Index 3
  4: "Room4@elrace.com", // Dahua Door/Index 4
}
\`\`\`

### Step 5: Test Room Access
Use the middleware test endpoint to verify each room:

\`\`\`bash
# Test Room 1
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{"index": 1, "data": {"UserID": 12345, "Door": 1}}'

# Test Room 2
curl -X POST https://elraceroom.vercel.app/test-event \
  -H "Content-Type: application/json" \
  -d '{"index": 2, "data": {"UserID": 12345, "Door": 2}}'
\`\`\`

### Troubleshooting
- Verify room mailboxes are created and accessible
- Check Yealink panels can sync with Office 365
- Ensure proper network connectivity between all devices
- Test Graph API permissions with `/test-graph-api` endpoint
