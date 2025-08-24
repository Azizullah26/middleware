"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Users, Calendar, Activity } from "lucide-react"

export default function DashboardPage() {
  const [status, setStatus] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch("/health")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch status:", error)
    }
  }

  const testGraphAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/test-graph-api")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ success: false, error: "Failed to test Graph API" })
    }
    setLoading(false)
  }

  const simulateEvent = async () => {
    setLoading(true)
    try {
      const response = await fetch("/test-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "FaceRecognition",
          action: "Start",
          index: 1,
          data: { UserID: "12345", Door: 1 },
        }),
      })
      const data = await response.json()
      alert("Event simulated successfully!")
    } catch (error) {
      alert("Failed to simulate event")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Dahua-Yealink Integration Dashboard</h1>
          <p className="text-muted-foreground">Monitor your face recognition to calendar integration system</p>
          {status?.previewMode && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Preview Mode Active - Safe Testing Enabled
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              {status ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status ? "Running" : "Offline"}</div>
              <p className="text-xs text-muted-foreground">
                {status ? `Since ${new Date(status.timestamp).toLocaleString()}` : "System not responding"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configured Rooms</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status?.rooms || 0}</div>
              <p className="text-xs text-muted-foreground">Room1-4@elrace.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status?.users || 0}</div>
              <p className="text-xs text-muted-foreground">Face recognition users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dahua Device</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status?.dahuaConnected ? "Connected" : "Offline"}</div>
              <p className="text-xs text-muted-foreground">Face recognition device</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Current middleware settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Room Mappings</h4>
                <div className="grid grid-cols-1 gap-2">
                  {status?.configuration?.rooms?.map((room: any, i: number) => (
                    <Badge key={room.email} variant="outline" className="justify-between">
                      <span>
                        Door {i + 1} → {room.name}
                      </span>
                      <span className="text-xs text-muted-foreground">({room.capacity} seats)</span>
                    </Badge>
                  )) ||
                    ["Room1@elrace.com", "Room2@elrace.com", "Room3@elrace.com", "Room4@elrace.com"].map((room, i) => (
                      <Badge key={room} variant="outline">
                        Door {i + 1} → {room}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">User Mappings</h4>
                <div className="space-y-1">
                  {status?.configuration?.users?.map((user: any) => (
                    <Badge key={user.email} variant="outline" className="justify-between">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">({user.role})</span>
                    </Badge>
                  )) || [
                    <Badge key="12345" variant="outline">
                      12345 → aziz@elrace.com
                    </Badge>,
                    <Badge key="67890" variant="outline">
                      67890 → user2@elrace.com
                    </Badge>,
                  ]}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testing & Monitoring</CardTitle>
              <CardDescription>Test your integration components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testGraphAPI} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test Microsoft Graph API"}
              </Button>
              <Button onClick={simulateEvent} disabled={loading} variant="outline" className="w-full bg-transparent">
                {loading ? "Simulating..." : "Simulate Face Recognition Event"}
              </Button>
              <Button onClick={fetchStatus} variant="secondary" className="w-full">
                Refresh Status
              </Button>
              {status?.environment && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-2">System Info</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Node.js: {status.environment.nodeVersion}</div>
                    <div>Platform: {status.environment.platform}</div>
                    <div>Uptime: {Math.floor(status.environment.uptime / 60)}m</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
