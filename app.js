require("dotenv").config()
const express = require("express")
const Dahua = require("node-dahua-api")
const { ConfidentialClientApplication } = require("@azure/msal-node")
const graph = require("@microsoft/microsoft-graph-client")

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  if (req.method === "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Environment variables
const dahuaOptions = {
  host: process.env.DAHUA_HOST,
  port: process.env.DAHUA_PORT || 80,
  user: process.env.DAHUA_USER,
  pass: process.env.DAHUA_PASS,
  log: true,
}

let dahua
try {
  dahua = new Dahua.Dahua(dahuaOptions)
  console.log(`[v0] 🔗 Connecting to Dahua device at ${dahuaOptions.host}:${dahuaOptions.port}`)
} catch (error) {
  console.error(`[v0] ❌ Failed to connect to Dahua device:`, error.message)
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

const PREVIEW_MODE = process.env.PREVIEW_MODE === "true"

// Subscribe to Dahua events
if (dahua) {
  dahua.on("alarm", async (code, action, index, data) => {
    if (action === "Start" && (code === "FaceRecognition" || code === "AccessControl")) {
      console.log(`[v0] Event received: ${code}, Index: ${index}, Data:`, data)
      const userId = data?.UserID || index.toString()
      const user = userMap[userId]
      const door = data?.Door || index
      const room = roomMap[door]

      if (!user || !room) {
        console.log(`[v0] User or room not mapped - UserID: ${userId}, Door: ${door}`)
        return
      }

      console.log(`[v0] Processing: ${user.email} -> ${room.email}`)
      await handleCalendarAction(user, room, code)
    }
  })
}

// Function to interact with Microsoft Graph
async function handleCalendarAction(user, room, eventCode) {
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
      } else {
        console.log(`[v0] ❌ User ${user.email} not authorized for current booking in ${room.email}`)
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

      await graphClient.api(`/users/${room.email}/calendar/events`).post(newEvent)
      console.log(`[v0] 📅 New reservation created for ${user.email} in ${room.email}`)
    }
  } catch (error) {
    console.error(`[v0] Graph API error:`, error.message)
    if (error.response) {
      console.error(`[v0] Response:`, error.response.data)
    }
  }
}

app.get("/health", (req, res) => {
  res.json({
    status: "running",
    timestamp: new Date().toISOString(),
    rooms: Object.keys(roomMap).length,
    users: Object.keys(userMap).length,
    previewMode: PREVIEW_MODE,
    dahuaConnected: !!dahua,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
    },
    configuration: {
      rooms: Object.values(roomMap).map((r) => ({ name: r.name, email: r.email, capacity: r.capacity })),
      users: Object.values(userMap).map((u) => ({ name: u.name, email: u.email, role: u.role })),
    },
  })
})

// Test endpoint for manual simulation
app.post("/test-event", async (req, res) => {
  const { code = "FaceRecognition", action = "Start", index = 1, data = {} } = req.body

  console.log(`[v0] Test event triggered:`, { code, action, index, data })

  // Simulate the Dahua event
  if (dahua) {
    dahua.emit("alarm", code, action, index, data)
  } else {
    console.log(`[v0] Dahua device not connected - simulating event processing`)
    const userId = data?.UserID || index.toString()
    const user = userMap[userId]
    const door = data?.Door || index
    const room = roomMap[door]

    if (user && room) {
      await handleCalendarAction(user, room, code)
    }
  }

  res.json({
    message: "Event simulated successfully",
    event: { code, action, index, data },
    previewMode: PREVIEW_MODE,
  })
})

app.get("/test-graph-api", async (req, res) => {
  try {
    const tokenResponse = await cca.acquireTokenByClientCredential({ scopes: graphScopes })
    const graphClient = graph.Client.init({
      authProvider: { getAccessToken: () => tokenResponse.accessToken },
    })

    // Test with Room1@elrace.com
    const testRoom = "Room1@elrace.com"
    const events = await graphClient.api(`/users/${testRoom}/calendar/events`).top(5).get()

    res.json({
      success: true,
      room: testRoom,
      eventsFound: events.value.length,
      timestamp: new Date().toISOString(),
      previewMode: PREVIEW_MODE,
      events: events.value.map((e) => ({
        id: e.id,
        subject: e.subject,
        start: e.start.dateTime,
        end: e.end.dateTime,
        location: e.location?.displayName,
        attendees: e.attendees?.map((a) => ({
          name: a.emailAddress.name,
          email: a.emailAddress.address,
          type: a.type,
        })),
      })),
    })
  } catch (error) {
    console.error(`[v0] Graph API test error:`, error)
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      details: error.response?.data,
    })
  }
})

app.get("/preview", (req, res) => {
  res.json({
    message: "Preview mode endpoint - safe testing without real calendar changes",
    previewMode: PREVIEW_MODE,
    instructions: "Set PREVIEW_MODE=true in environment variables to enable preview mode",
    testEndpoints: {
      health: "/health",
      testEvent: "POST /test-event",
      testGraphAPI: "/test-graph-api",
    },
    configuration: {
      rooms: roomMap,
      users: userMap,
    },
  })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[v0] 🚀 Dahua-Yealink Integration Middleware running on port ${PORT}`)
  console.log(`[v0] Preview Mode: ${PREVIEW_MODE ? "ENABLED" : "DISABLED"}`)
  console.log(`[v0] Health check: http://localhost:${PORT}/health`)
  console.log(`[v0] Test endpoint: POST http://localhost:${PORT}/test-event`)
  console.log(`[v0] Graph API test: GET http://localhost:${PORT}/test-graph-api`)
  console.log(`[v0] Preview endpoint: GET http://localhost:${PORT}/preview`)
})
