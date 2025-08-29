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

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const PREVIEW_MODE = process.env.PREVIEW_MODE === "true"

  res.status(200).json({
    status: "running",
    timestamp: new Date().toISOString(),
    rooms: Object.keys(roomMap).length,
    users: Object.keys(userMap).length,
    previewMode: PREVIEW_MODE,
    dahuaConnected: !!(process.env.DAHUA_HOST && process.env.DAHUA_USER && process.env.DAHUA_PASS),
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
}
