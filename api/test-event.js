const userMappings = {
  12345: { email: "aziz@elrace.com", name: "Aziz", role: "Admin" },
  67890: { email: "user2@elrace.com", name: "User 2", role: "Employee" },
}

const roomMappings = {
  door1: { email: "Room1@elrace.com", name: "Conference Room 1", capacity: 10 },
  door2: { email: "Room2@elrace.com", name: "Conference Room 2", capacity: 8 },
  door3: { email: "Room3@elrace.com", name: "Conference Room 3", capacity: 6 },
  door4: { email: "Room4@elrace.com", name: "Conference Room 4", capacity: 12 },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { userId = "12345", doorId = "door1", eventType = "face_recognized" } = req.body

    const user = userMappings[userId]
    const room = roomMappings[doorId]

    if (!user || !room) {
      return res.status(400).json({
        error: "Invalid user or room",
        userId,
        doorId,
        availableUsers: Object.keys(userMappings),
        availableRooms: Object.keys(roomMappings),
      })
    }

    const isPreviewMode = process.env.PREVIEW_MODE === "true"

    const response = {
      success: true,
      message: `${isPreviewMode ? "[PREVIEW] " : ""}Face recognition event processed`,
      data: {
        user: user,
        room: room,
        eventType,
        timestamp: new Date().toISOString(),
        action: "auto_checkin_or_create_reservation",
        previewMode: isPreviewMode,
      },
    }

    if (isPreviewMode) {
      response.note = "Preview mode - no actual calendar changes made"
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Test event error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}
