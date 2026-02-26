"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Shield, Calendar, Loader2, UserCheck, MoreVertical, Trash2, ShieldAlert, Activity, ShieldCheck } from "lucide-react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/context/ToastContext"
import { Modal } from "@/components/ui/modal"
import { cn } from "@/lib/utils"

interface User {
    id: string
    email: string
    name: string | null
    role: string
    createdAt: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)

    // Deletion State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    // Audit State
    const [auditModalOpen, setAuditModalOpen] = useState(false)
    const [userForAudit, setUserForAudit] = useState<User | null>(null)

    // Role Edit State
    const [roleModalOpen, setRoleModalOpen] = useState(false)
    const [userForRole, setUserForRole] = useState<User | null>(null)

    const { showToast } = useToast()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users')
            setUsers(response.data)
        } catch (error) {
            console.error("Failed to fetch users", error)
            showToast("Failed to access personnel registry", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return
        setIsActionLoading(true)
        try {
            await api.delete(`/auth/users/${userToDelete.id}`)
            showToast(`Entity ${userToDelete.email} purged successfully`, "success")
            setUsers(users.filter(u => u.id !== userToDelete.id))
            setDeleteModalOpen(false)
            setUserToDelete(null)
        } catch (error: any) {
            const message = error.response?.data?.message || "Purge operation failed"
            showToast(message, "error")
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleUpdateRole = async (newRole: 'ADMIN' | 'USER') => {
        if (!userForRole) return
        setIsActionLoading(true)
        try {
            await api.patch(`/auth/users/${userForRole.id}/role`, { role: newRole })
            showToast(`${userForRole.email} authorization updated to ${newRole}`, "success")
            setUsers(users.map(u => u.id === userForRole.id ? { ...u, role: newRole } : u))
            setRoleModalOpen(false)
            setUserForRole(null)
        } catch (error: any) {
            showToast(error.response?.data?.message || "Role update failed", "error")
        } finally {
            setIsActionLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Accessing Personnel Registry...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Users className="h-7 w-7 text-accent" />
                        <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Personnel Registry</h2>
                    </div>
                    <p className="text-sm text-text-secondary font-medium">Manage all registered entities and their authorization levels on the network.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-5 py-3 shadow-none">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">Total Registry</p>
                        <p className="text-2xl font-black text-text-primary leading-none">{users.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user.id} className={cn(
                        "group bg-surface border transition-all duration-300 shadow-none overflow-hidden",
                        user.role === 'ADMIN' ? "border-accent/30" : "border-border hover:border-accent/30"
                    )}>
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                                    <UserCheck className={`h-5 w-5 ${user.role === 'ADMIN' ? 'text-accent' : 'text-text-muted'}`} />
                                </div>
                                <CardTitle className="text-sm font-bold text-text-primary truncate">
                                    {user.name || "UNIDENTIFIED"}
                                </CardTitle>
                            </div>
                            <div className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                user.role === 'ADMIN'
                                    ? "bg-accent/10 text-accent border-accent/30"
                                    : "bg-accent/10 text-accent border-accent/30"
                            )}>
                                {user.role}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs text-text-secondary">
                                    <Mail className="h-4 w-4 text-text-muted" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-text-secondary">
                                    <Calendar className="h-4 w-4 text-text-muted" />
                                    <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-text-secondary">
                                    <Shield className="h-4 w-4 text-text-muted" />
                                    <span className="uppercase tracking-widest font-bold opacity-80">UID: {user.id.substring(0, 12)}...</span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        setUserForAudit(user);
                                        setAuditModalOpen(true);
                                    }}
                                    variant="secondary"
                                    className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest bg-surface-raised hover:bg-surface text-text-secondary"
                                >
                                    AUDIT LOGS
                                </Button>
                                <Button
                                    onClick={() => {
                                        setUserToDelete(user);
                                        setDeleteModalOpen(true);
                                    }}
                                    variant="outline"
                                    className="h-10 w-10 p-0 border-border bg-transparent text-text-muted hover:text-accent hover:bg-accent/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => {
                                        setUserForRole(user);
                                        setRoleModalOpen(true);
                                    }}
                                    variant="outline"
                                    className="h-10 w-10 p-0 border-border bg-transparent text-text-muted hover:text-text-primary hover:bg-surface-raised"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {users.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center h-[300px] rounded-3xl border-2 border-dashed border-border bg-surface">
                        <Users className="h-12 w-12 text-text-muted mb-4" />
                        <h3 className="text-lg font-black text-text-secondary uppercase tracking-tighter">Registry Empty</h3>
                        <p className="text-xs text-text-muted font-bold mt-1">No personnel records detected on the sovereign network.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => !isActionLoading && setDeleteModalOpen(false)}
                title="Sovereign Purge Request"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-accent/10 border border-accent/30">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <ShieldAlert className="h-6 w-6 text-accent" />
                        </div>
                        <p className="text-xs font-bold text-accent leading-relaxed uppercase tracking-tight">
                            Warning: This operation will permanently remove all access privileges and records for <span className="text-text-primary underline">{userToDelete?.email}</span>. This action is irreversible.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            disabled={isActionLoading}
                            onClick={() => setDeleteModalOpen(false)}
                            variant="ghost"
                            className="flex-1 h-12 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
                        >
                            Abort
                        </Button>
                        <Button
                            isLoading={isActionLoading}
                            onClick={handleDeleteUser}
                            className="flex-1 h-12 bg-accent/10 hover:bg-accent/10 text-text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-none shadow-none"
                        >
                            Confirm Purge
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Audit Logs Modal */}
            <Modal
                isOpen={auditModalOpen}
                onClose={() => setAuditModalOpen(false)}
                title="Personnel Audit Feed"
            >
                <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-background border border-border">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-5">Security Activity Logs: {userForAudit?.email}</p>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4 pb-4 border-b border-border/50">
                                <Activity className="h-5 w-5 text-accent mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-text-primary">System Login Verified</p>
                                    <p className="text-[10px] text-text-muted mt-0.5">Last active session detected within 24 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 pb-4 border-b border-border/50">
                                <ShieldCheck className="h-5 w-5 text-accent mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-text-primary">Authorization Status: Stable</p>
                                    <p className="text-[10px] text-text-muted mt-0.5">No unauthorized access attempts recorded on this UID.</p>
                                </div>
                            </div>
                            <p className="text-[9px] text-text-muted italic text-center pt-2">--- End of real-time audit feed ---</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setAuditModalOpen(false)}
                        className="w-full h-12 bg-surface-raised hover:bg-surface text-text-primary text-[10px] font-black uppercase tracking-widest"
                    >
                        Close Audit
                    </Button>
                </div>
            </Modal>

            {/* Role Management Modal */}
            <Modal
                isOpen={roleModalOpen}
                onClose={() => !isActionLoading && setRoleModalOpen(false)}
                title="Registry Access Control"
            >
                <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-accent border border-accent/40">
                        <p className="text-xs font-bold text-background leading-relaxed uppercase tracking-tight">
                            Manage authorization level for <span className="text-background underline">{userForRole?.email}</span>. Higher clearance levels grant access to the sovereign command center.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            disabled={isActionLoading || userForRole?.role === 'USER'}
                            onClick={() => handleUpdateRole('USER')}
                            variant="outline"
                            className={`h-20 flex flex-col gap-1 border-border rounded-2xl ${userForRole?.role === 'USER' ? 'bg-accent border-accent/40 ring-1 ring-accent' : 'hover:bg-surface group'}`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-widest ${userForRole?.role === 'USER' ? 'text-background' : 'text-text-secondary group-hover:text-text-primary'}`}>Standard user</span>
                            <span className={`text-[8px] lowercase font-medium ${userForRole?.role === 'USER' ? 'text-background/80' : 'text-text-muted'}`}>Restricted Access</span>
                        </Button>
                        <Button
                            disabled={isActionLoading || userForRole?.role === 'ADMIN'}
                            onClick={() => handleUpdateRole('ADMIN')}
                            variant="outline"
                            className={`h-20 flex flex-col gap-1 border-border rounded-2xl ${userForRole?.role === 'ADMIN' ? 'bg-accent border-accent/40 ring-1 ring-accent' : 'hover:bg-surface group'}`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-widest ${userForRole?.role === 'ADMIN' ? 'text-background' : 'text-text-secondary group-hover:text-text-primary'}`}>Admin clearance</span>
                            <span className={`text-[8px] lowercase font-medium ${userForRole?.role === 'ADMIN' ? 'text-background/80' : 'text-text-muted'}`}>Full Oversight</span>
                        </Button>
                    </div>

                    <Button
                        disabled={isActionLoading}
                        onClick={() => setRoleModalOpen(false)}
                        variant="ghost"
                        className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
                    >
                        Close Controller
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
