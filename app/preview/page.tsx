"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, XCircle, Activity, Eye, Bug } from "lucide-react"

export default function PreviewPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [testData, setTestData] = useState({
    userID: "12345",
    door: "1",
    action: "Start",
  })
  const [customEvent, setCustomEvent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
        setErrors(data.errors || [])
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    }
  }

  const testEvent = async () => {
    setLoading(true)
    try {
      const response = await fetch("/test-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "FaceRecognition",
          action: testData.action,
          index: Number.parseInt(testData.door),
          data: {
            UserID: testData.userID,
            Door: Number.parseInt(testData.door),
            timestamp: new Date().toISOString(),
          },
        }),
      })
      const result = await response.json()

      // Add to logs for immediate feedback
      setLogs((prev) => [
        {
          timestamp: new Date().toISOString(),
          type: response.ok ? "success" : "error",
          message: `Test Event: ${JSON.stringify(result)}`,
          source: "preview-test",
        },
        ...prev.slice(0, 49),
      ]) // Keep last 50 logs
    } catch (error) {
      setErrors((prev) => [
        {
          timestamp: new Date().toISOString(),
          error: error.message,
          source: "preview-test",
        },
        ...prev.slice(0, 19),
      ]) // Keep last 20 errors
    }
    setLoading(false)
  }

  const testCustomEvent = async () => {
    if (!customEvent.trim()) return

    setLoading(true)
    try {
      const eventData = JSON.parse(customEvent)
      const response = await fetch("/test-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })
      const result = await response.json()

      setLogs((prev) => [
        {
          timestamp: new Date().toISOString(),
          type: response.ok ? "success" : "error",
          message: `Custom Event: ${JSON.stringify(result)}`,
          source: "custom-test",
        },
        ...prev.slice(0, 49),
      ])
    } catch (error) {
      setErrors((prev) => [
        {
          timestamp: new Date().toISOString(),
          error: `Custom Event Error: ${error.message}`,
          source: "custom-test",
        },
        ...prev.slice(0, 19),
      ])
    }
    setLoading(false)
  }

  const clearLogs = () => {
    setLogs([])
    setErrors([])
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Eye className="h-8 w-8 text-blue-600" />
            Preview & Error Monitoring
          </h1>
          <p className="text-muted-foreground">Test events and monitor system errors in real-time</p>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Safe Testing Environment - No Real Calendar Changes
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Event Testing
              </CardTitle>
              <CardDescription>Simulate Dahua face recognition events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userID">User ID</Label>
                <Input
                  id="userID"
                  value={testData.userID}
                  onChange={(e) => setTestData((prev) => ({ ...prev, userID: e.target.value }))}
                  placeholder="12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="door">Door Number</Label>
                <Input
                  id="door"
                  value={testData.door}
                  onChange={(e) => setTestData((prev) => ({ ...prev, door: e.target.value }))}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={testData.action}
                  onChange={(e) => setTestData((prev) => ({ ...prev, action: e.target.value }))}
                >
                  <option value="Start">Start</option>
                  <option value="Stop">Stop</option>
                </select>
              </div>

              <Button onClick={testEvent} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Send Test Event"}
              </Button>

              <div className="pt-4 border-t">
                <Label htmlFor="custom">Custom Event JSON</Label>
                <Textarea
                  id="custom"
                  value={customEvent}
                  onChange={(e) => setCustomEvent(e.target.value)}
                  placeholder='{"code":"FaceRecognition","action":"Start","data":{"UserID":"12345","Door":1}}'
                  rows={4}
                />
                <Button
                  onClick={testCustomEvent}
                  disabled={loading}
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                >
                  Send Custom Event
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Logs
                </CardTitle>
                <CardDescription>Real-time system activity and responses</CardDescription>
              </div>
              <Button onClick={clearLogs} variant="outline" size="sm">
                Clear Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No logs yet. Send a test event to see activity.
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-md">
                      {log.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.source}
                          </Badge>
                        </div>
                        <p className="text-sm break-words">{log.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Monitoring */}
        {errors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Error Log ({errors.length})
              </CardTitle>
              <CardDescription>System errors and debugging information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {errors.map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 text-xs text-red-600 mb-1">
                      <span>{new Date(error.timestamp).toLocaleTimeString()}</span>
                      <Badge variant="destructive" className="text-xs">
                        {error.source}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-800">{error.error}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>Common test scenarios and expected responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">User Mappings</h4>
                <div className="space-y-1 text-sm">
                  <div>UserID: 12345 → aziz@elrace.com</div>
                  <div>UserID: 67890 → user2@elrace.com</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Room Mappings</h4>
                <div className="space-y-1 text-sm">
                  <div>Door 1 → Room1@elrace.com</div>
                  <div>Door 2 → Room2@elrace.com</div>
                  <div>Door 3 → Room3@elrace.com</div>
                  <div>Door 4 → Room4@elrace.com</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
