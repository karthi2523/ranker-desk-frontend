"use client"

import { useEffect, useState } from "react"
import { DeviceCard } from "@/components/features/DeviceCard"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ShieldAlert, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"

export default function DevicesPage() {
    const { user } = useAuth()
    const { showToast } = useToast()
    const [sessions, setSessions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [revokingId, setRevokingId] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            fetchSessions()
        }
    }, [user])

    const fetchSessions = async () => {
        try {
            const response = await api.get('/auth/sessions')
            // Map sessions to DeviceCard format
            const mapped = response.data.map((s: any) => ({
                id: s.id,
                name: s.deviceFingerprint || "Unknown Device",
                type: "Device",
                location: "Unknown",
                lastActive: s.isActive ? "Active now" : new Date(s.lastActiveAt).toLocaleString(),
                isCurrent: s.isActive // Simple heuristic for now
            }))
            setSessions(mapped)
        } catch (error) {
            console.error("Failed to fetch sessions", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogoutAll = async () => {
        if (!confirm("Are you sure you want to logout all devices?")) return
        try {
            await api.post('/auth/logout')
            window.location.reload()
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    const handleRevoke = async (sessionId: string) => {
        try {
            setRevokingId(sessionId)
            await api.put(`/auth/sessions/${sessionId}/revoke`)
            showToast("Session revoked successfully", "success")
            fetchSessions()
        } catch (error) {
            console.error("Revoke failed", error)
            showToast("Failed to revoke session", "error")
        } finally {
            setRevokingId(null)
        }
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Device Management</h2>
                    <p className="text-slate-400">Manage your active sessions for All Gov Alerts.</p>
                </div>
                <Button variant="destructive" className="gap-2" onClick={handleLogoutAll}>
                    <ShieldAlert className="h-4 w-4" />
                    Logout All Devices
                </Button>
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div className="text-sm text-yellow-200">
                        <span className="font-semibold">Security Alert:</span> Only one active session is allowed at a time on All Gov Alerts. Logging in from a new device will verify your identity.
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((device) => (
                    <DeviceCard
                        key={device.id}
                        device={device}
                        onRevoke={handleRevoke}
                        isLoading={revokingId === device.id}
                    />
                ))}
            </div>
        </div>
    )
}
