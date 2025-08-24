const { MongoClient } = require("mongodb")
require("dotenv").config()

async function setupDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dahua-integration"
  const client = new MongoClient(uri)

  try {
    console.log("[v0] Connecting to MongoDB...")
    await client.connect()

    const db = client.db("dahua-integration")

    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ userId: 1 }, { unique: true })
    await usersCollection.createIndex({ email: 1 }, { unique: true })

    // Insert default users
    const defaultUsers = [
      {
        userId: "12345",
        email: "aziz@elrace.com",
        name: "Aziz",
        department: "Admin",
        accessLevel: "full",
        createdAt: new Date(),
      },
      {
        userId: "67890",
        email: "user2@elrace.com",
        name: "User 2",
        department: "Staff",
        accessLevel: "standard",
        createdAt: new Date(),
      },
    ]

    for (const user of defaultUsers) {
      await usersCollection.updateOne({ userId: user.userId }, { $setOnInsert: user }, { upsert: true })
    }

    const roomsCollection = db.collection("rooms")
    await roomsCollection.createIndex({ roomId: 1 }, { unique: true })
    await roomsCollection.createIndex({ email: 1 }, { unique: true })

    // Insert room configurations
    const defaultRooms = [
      {
        roomId: "room1",
        email: "Room1@elrace.com",
        name: "Conference Room 1",
        capacity: 8,
        location: "Floor 1",
        equipment: ["Projector", "Whiteboard", "Video Conference"],
        createdAt: new Date(),
      },
      {
        roomId: "room2",
        email: "Room2@elrace.com",
        name: "Conference Room 2",
        capacity: 12,
        location: "Floor 1",
        equipment: ["Projector", "Whiteboard"],
        createdAt: new Date(),
      },
      {
        roomId: "room3",
        email: "Room3@elrace.com",
        name: "Conference Room 3",
        capacity: 6,
        location: "Floor 2",
        equipment: ["TV Screen", "Whiteboard"],
        createdAt: new Date(),
      },
      {
        roomId: "room4",
        email: "Room4@elrace.com",
        name: "Conference Room 4",
        capacity: 4,
        location: "Floor 2",
        equipment: ["TV Screen"],
        createdAt: new Date(),
      },
    ]

    for (const room of defaultRooms) {
      await roomsCollection.updateOne({ roomId: room.roomId }, { $setOnInsert: room }, { upsert: true })
    }

    const eventsCollection = db.collection("events")
    await eventsCollection.createIndex({ timestamp: 1 })
    await eventsCollection.createIndex({ userId: 1 })
    await eventsCollection.createIndex({ roomId: 1 })

    console.log("[v0] Database setup completed successfully!")
    console.log("[v0] Collections created: users, rooms, events")
    console.log("[v0] Default users and rooms inserted")
  } catch (error) {
    console.error("[v0] Database setup failed:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
