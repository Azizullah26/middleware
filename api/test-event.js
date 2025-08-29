const { ConfidentialClientApplication } = require("@azure/msal-node")
const graph = require("@microsoft/microsoft-graph-client")

const userMap = {
  12345: { email: "aziz@elrace.com", name: "Aziz", role: "admin" },
  67890: { email: "user2@elrace.com", name: "User 2", role: "employee" },
  11111: { email: "user3@elrace.com", name: "User 3", role: "employee" },
  22222: { email: "user4@elrace.com", name: "User 4", role: "employee" },
}

const roomMap = {
  1: { email: "Room1@elrace.com", name: "Conference Room 1", capacity: 8 },
  2: { email: "Room2@elrace.com", name: "Conference Room 2", capacity: 6 },
  3: { email: "Room3@elrace.com", name: "Conference Room 3", capacity: 4 },
  4: { email: "Room4@elrace.com", name: "Conference Room 4", capacity: 10 },
}

// Microsoft Graph config
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
}
const cca = new ConfidentialClientApplication(msalConfig)
const graphScopes = ["https://graph.microsoft.com/.default"]

// Function to interact with Microsoft Graph
async function handleCalendarAction(user, room, eventCode) {
  const PREVIEW_MODE = process.env.PREVIEW_MODE === "true"

  try {
    if (PREVIEW_MODE) {
      console.log(`[v0] 🔍 PREVIEW MODE: Would process calendar action for ${user.email} in ${room.email}`)
      return { preview: true, user: user.email, room: room.email, eventCode }
    }

    console.log(`[v0] Getting Graph API token...`)
    const tokenResponse = await cca.acquireTokenByClientCredential({ scopes: graphScopes })
    const accessToken = tokenResponse.accessToken

    const graphClient = graph.Client.init({
      authProvider: { getAccessToken: () => accessToken },
    })

    // Get current time window (now to +1 hour)
    const now = new Date().toISOString()
    const end = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    console.log(`[v0] Fetching events for ${room.email} from ${now} to ${end}`)

    // Fetch events for the specific room
    const events = await graphClient
      .api(`/users/${room.email}/calendar/events`)
      .filter(`start/dateTime ge '${now}' and end/dateTime le '${end}'`)
      .get()

    console.log(`[v0] Found ${events.value.length} events`)

    if (events.value.length > 0) {
      const event = events.value[0]
      const isUserAttendee = event.attendees.some(
        (att) => att.emailAddress.address.toLowerCase() === user.email.toLowerCase(),
      )

      if (isUserAttendee) {
        // Auto check-in: Update event body
        await graphClient.api(`/users/${room.email}/calendar/events/${event.id}`).patch({
          body: {
            content: `Auto check-in via ${eventCode} for ${user.name} (${user.email}) at ${new Date().toLocaleString()}`,
            contentType: "text",
          },
        })
        console.log(`[v0] ✅ Auto check-in successful for ${user.email} in ${room.email}`)
        return { action: "auto_checkin", user: user.email, room: room.email, eventId: event.id }
      } else {
        console.log(`[v0] ❌ User ${user.email} not authorized for current booking in ${room.email}`)
        return { action: "unauthorized", user: user.email, room: room.email, reason: "Not an attendee" }
      }
    } else {
      // No booking: Create a new reservation
      const newEvent = {
        subject: `Auto Reservation - ${user.name}`,
        start: { dateTime: now, timeZone: "UTC" },
        end: { dateTime: end, timeZone: "UTC" },
        location: { displayName: room.name },
        attendees: [
          { emailAddress: { address: user.email, name: user.name }, type: "required" },
          { emailAddress: { address: room.email, name: room.name }, type: "resource" },
        ],
        body: {
          content: `Auto-created reservation via ${eventCode} for ${user.name} at ${new Date().toLocaleString()}`,
          contentType: "text",
        },
      }

      const createdEvent = await graphClient.api(`/users/${room.email}/calendar/events`).post(newEvent)
      console.log(`[v0] 📅 New reservation created for ${user.email} in ${room.email}`)
      return { action: "new_reservation", user: user.email, room: room.email, eventId: createdEvent.id }
    }
  } catch (error) {
    console.error(`[v0] Graph API error:`, error.message)
    throw error
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { code = "FaceRecognition", action = "Start", index = 1, data = {} } = req.body
    const PREVIEW_MODE = process.env.PREVIEW_MODE === "true"

    console.log(`[v0] Test event triggered:`, { code, action, index, data })

    // Process the event like the original Express middleware
    const userId = data?.UserID || index.toString()
    const user = userMap[userId]
    const door = data?.Door || index
    const room = roomMap[door]

    if (!user || !room) {
      return res.status(400).json({
        error: "User or room not mapped",
        userId,
        door,
        availableUsers: Object.keys(userMap),
        availableRooms: Object.keys(roomMap),
      })
    }

    console.log(`[v0] Processing: ${user.email} -> ${room.email}`)
    const result = await handleCalendarAction(user, room, code)

    res.status(200).json({
      success: true,
      message: "Event simulated successfully",
      event: { code, action, index, data },
      result,
      previewMode: PREVIEW_MODE,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test event error:", error)
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data,
      timestamp: new Date().toISOString(),
    })
  }
}
