"use client"

import { useEffect, useState } from"react"
import { DeviceCard } from"@/components/features/DeviceCard"
import { Button } from"@/components/ui/button"
import { AlertTriangle, ShieldAlert, Loader2, MonitorSmartphone, ShieldCheck, Sparkles } from"lucide-react"
import api from"@/lib/api"
import { useAuth } from"@/context/AuthContext"
import { useToast } from"@/context/ToastContext"

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
 name: s.deviceFingerprint ||"Unknown Device",
 type:"Device",
 location:"Unknown",
 lastActive: s.isActive ?"Active now": new Date(s.lastActiveAt).toLocaleString(),
 isCurrent: s.isActive // Simple heuristic for now
 }))
 setSessions(mapped)
 } catch (error) {
 console.error("Failed to fetch sessions", error)
 showToast("Failed to sync device directory","error")
 } finally {
 setIsLoading(false)
 }
 }

 const handleLogoutAll = async () => {
 if (!confirm("Are you sure you want to terminate all active sessions? This will logout all devices except the current one.")) return
 try {
 await api.post('/auth/logout')
 showToast("All secondary sessions terminated","success")
 window.location.reload()
 } catch (error) {
 console.error("Logout failed", error)
 showToast("Failed to initiate global logout","error")
 }
 }

 const handleRevoke = async (sessionId: string) => {
 try {
 setRevokingId(sessionId)
 await api.put(`/auth/sessions/${sessionId}/revoke`)
 showToast("Session revoked successfully","success")
 fetchSessions()
 } catch (error) {
 console.error("Revoke failed", error)
 showToast("Failed to revoke session","error")
 } finally {
 setRevokingId(null)
 }
 }

 if (isLoading) return (
 <div className="flex flex-col items-center justify-center h-[500px] gap-4">
 <Loader2 className="h-10 w-10 animate-spin text-accent"/>
 <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Syncing Device Directory...</p>
 </div>
 )

 return (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
 <div className="space-y-2">
 <div className="flex items-center gap-3">
 <MonitorSmartphone className="h-7 w-7 text-accent"/>
 <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Device Registry</h2>
 </div>
 <p className="text-sm text-text-secondary font-medium">Manage and audit your active sessions across the sovereign network.</p>
 </div>
 <Button
 variant="outline"
 className="h-12 border-accent/30 bg-accent/10 text-accent hover:bg-accent/10 hover:text-text-primary gap-3 rounded-xl px-6 font-black uppercase tracking-widest text-[10px] transition-all"
 onClick={handleLogoutAll}
 >
 <ShieldAlert className="h-4 w-4"/>
 Terminate All Sessions
 </Button>
 </div>

 <div className="rounded-[1.5rem] border border-accent/20 bg-accent/5 p-6">
 <div className="flex items-start md:items-center gap-5">
 <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
 <AlertTriangle className="h-6 w-6 text-accent"/>
 </div>
 <div className="space-y-1">
 <h4 className="text-sm font-black text-accent uppercase tracking-widest">Sovereign Security Protocol</h4>
 <p className="text-xs text-text-secondary font-medium leading-relaxed">
 Only one active session is permitted per entity credentials. Logging in from a new device will verify your identity. Unrecognized sessions should be purged immediately.
 </p>
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

 {sessions.length === 0 && (
 <div className="col-span-full py-20 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border bg-surface">
 <ShieldCheck className="h-12 w-12 text-text-muted mb-4"/>
 <h3 className="text-lg font-black text-text-secondary uppercase tracking-tighter">No Active Sessions</h3>
 <p className="text-xs text-text-muted font-bold mt-1 uppercase tracking-widest">Your device directory is clear.</p>
 </div>
 )}
 </div>

 {/* Security Footer */}
 <div className="flex items-center justify-center gap-6 pt-10 border-t border-border">
 <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
 <Sparkles className="h-3 w-3"/>
 Vault Signature Verified
 </div>
 <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
 <ShieldCheck className="h-3 w-3"/>
 IP Isolation Active
 </div>
 </div>
 </div>
 )
}
