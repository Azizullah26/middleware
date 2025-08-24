const axios = require("axios")

const BASE_URL = "http://localhost:3000"

async function runTests() {
  console.log("🧪 Starting integration tests...\n")

  try {
    // Test 1: Health check
    console.log("1. Testing health endpoint...")
    const health = await axios.get(`${BASE_URL}/health`)
    console.log("✅ Health check passed:", health.data)

    // Test 2: Graph API connectivity
    console.log("\n2. Testing Graph API connectivity...")
    const graphTest = await axios.get(`${BASE_URL}/test-graph-api`)
    console.log("✅ Graph API test passed:", graphTest.data)

    // Test 3: Simulate face recognition event
    console.log("\n3. Testing face recognition simulation...")
    const eventTest = await axios.post(`${BASE_URL}/test-event`, {
      code: "FaceRecognition",
      action: "Start",
      index: 1,
      data: { UserID: "12345" },
    })
    console.log("✅ Event simulation passed:", eventTest.data)

    console.log("\n🎉 All tests passed! Integration is working correctly.")
  } catch (error) {
    console.error("❌ Test failed:", error.message)
    if (error.response) {
      console.error("Response:", error.response.data)
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
}

module.exports = { runTests }
