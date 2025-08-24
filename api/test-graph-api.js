export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const requiredEnvVars = ["AZURE_CLIENT_ID", "AZURE_TENANT_ID", "AZURE_CLIENT_SECRET"]
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return res.status(500).json({
        error: "Missing environment variables",
        missing: missingVars,
        message: "Please configure Azure credentials in Vercel dashboard",
      })
    }

    const response = {
      success: true,
      message: "Graph API configuration test",
      data: {
        clientId: process.env.AZURE_CLIENT_ID ? "Configured" : "Missing",
        tenantId: process.env.AZURE_TENANT_ID ? "Configured" : "Missing",
        clientSecret: process.env.AZURE_CLIENT_SECRET ? "Configured" : "Missing",
        timestamp: new Date().toISOString(),
        note: "Environment variables are properly configured for Graph API access",
      },
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Graph API test error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}
