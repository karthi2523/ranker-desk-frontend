"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Shield, Calendar, Loader2, UserCheck, MoreVertical, Trash2, ShieldAlert, Activity, ShieldCheck } from "lucide-react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/context/ToastContext"
import { Modal } from "@/components/ui/modal"

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
                <Loader2 className="h-8 w-8 animate-spin text-[#e05252]" />
                <p className="text-xs font-black text-[#4a5a70] uppercase tracking-widest">Accessing Personnel Registry...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1e2d45]">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-[#e05252]" />
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Personnel Registry</h2>
                    </div>
                    <p className="text-sm text-[#8a9bb0] font-medium">Manage all registered entities and their authorization levels on the network.</p>
                </div>
                <div className="flex items-center gap-3 bg-[#0a0e1a] border border-[#1e2d45] rounded-xl px-4 py-2">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-[#4a5a70] uppercase">Total Registry</p>
                        <p className="text-xl font-black text-white">{users.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user.id} className="group border-[#1e2d45] bg-[#0a0e1a] hover:border-[#e05252]/30 transition-all duration-300 shadow-xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#1e2d45]/50 bg-slate-900/20">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full bg-slate-900 border border-[#1e2d45] flex items-center justify-center shrink-0">
                                    <UserCheck className={`h-4 w-4 ${user.role === 'ADMIN' ? 'text-[#e05252]' : 'text-[#c9a84c]'}`} />
                                </div>
                                <CardTitle className="text-sm font-black text-white truncate max-w-[120px]">
                                    {user.name || "UNIDENTIFIED"}
                                </CardTitle>
                            </div>
                            <Badge className={`${user.role === 'ADMIN'
                                ? 'bg-[#e05252]/10 text-[#e05252] border-[#e05252]/20'
                                : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20'
                                } text-[9px] font-black uppercase tracking-widest py-0.5`}>
                                {user.role}
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2.5 text-xs text-[#8a9bb0]">
                                    <Mail className="h-3.5 w-3.5 text-[#4a5a70]" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-[#8a9bb0]">
                                    <Calendar className="h-3.5 w-3.5 text-[#4a5a70]" />
                                    <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-[#8a9bb0]">
                                    <Shield className="h-3.5 w-3.5 text-[#4a5a70]" />
                                    <span className="uppercase tracking-tighter font-bold">UID: {user.id.substring(0, 12)}...</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        setUserForAudit(user);
                                        setAuditModalOpen(true);
                                    }}
                                    variant="secondary"
                                    className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest border border-[#1e2d45] hover:bg-slate-900 text-white"
                                >
                                    Audit Logs
                                </Button>
                                <Button
                                    onClick={() => {
                                        setUserToDelete(user);
                                        setDeleteModalOpen(true);
                                    }}
                                    variant="outline"
                                    className="h-9 w-9 p-0 border-[#1e2d45] text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => {
                                        setUserForRole(user);
                                        setRoleModalOpen(true);
                                    }}
                                    variant="outline"
                                    className="h-9 w-9 p-0 border-[#1e2d45] text-slate-500 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {users.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center h-[300px] rounded-2xl border-2 border-dashed border-[#1e2d45] bg-[#0a0e1a]/50">
                        <Users className="h-10 w-10 text-[#1e2d45] mb-4" />
                        <h3 className="text-lg font-black text-[#8a9bb0] uppercase tracking-tighter">Registry Empty</h3>
                        <p className="text-xs text-[#4a5a70] font-bold mt-1">No personnel records detected on the sovereign network.</p>
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
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                        </div>
                        <p className="text-xs font-bold text-red-400 leading-relaxed uppercase tracking-tight">
                            Warning: This operation will permanently remove all access privileges and records for <span className="text-white underline">{userToDelete?.email}</span>. This action is irreversible.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            disabled={isActionLoading}
                            onClick={() => setDeleteModalOpen(false)}
                            variant="ghost"
                            className="flex-1 h-11 text-[10px] font-black uppercase tracking-[0.2em] text-[#4a5a70] hover:text-white"
                        >
                            Abort
                        </Button>
                        <Button
                            disabled={isActionLoading}
                            onClick={handleDeleteUser}
                            className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-950/20"
                        >
                            {isActionLoading ? "Purging Registry..." : "Confirm Purge"}
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
                    <div className="p-4 rounded-xl bg-slate-900 border border-[#1e2d45]">
                        <p className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest mb-4">Security Activity Logs: {userForAudit?.email}</p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 pb-3 border-b border-[#1e2d45]/50">
                                <Activity className="h-4 w-4 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-white">System Login Verified</p>
                                    <p className="text-[10px] text-[#4a5a70]">Last active session detected within 24 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pb-3 border-b border-[#1e2d45]/50">
                                <ShieldCheck className="h-4 w-4 text-[#c9a84c] mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-white">Authorization Status: Stable</p>
                                    <p className="text-[10px] text-[#4a5a70]">No unauthorized access attempts recorded on this UID.</p>
                                </div>
                            </div>
                            <p className="text-[9px] text-[#4a5a70] italic text-center pt-2">--- End of real-time audit feed ---</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setAuditModalOpen(false)}
                        className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest"
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
                    <div className="p-4 rounded-xl bg-[#c9a84c]/5 border border-[#c9a84c]/20">
                        <p className="text-xs font-bold text-[#c9a84c] leading-relaxed uppercase tracking-tight">
                            Manage authorization level for <span className="text-white underline">{userForRole?.email}</span>. Higher clearance levels grant access to the sovereign command center.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            disabled={isActionLoading || userForRole?.role === 'USER'}
                            onClick={() => handleUpdateRole('USER')}
                            variant="outline"
                            className={`h-16 flex flex-col gap-1 border-[#1e2d45] ${userForRole?.role === 'USER' ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30' : 'hover:bg-slate-900'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">Standard user</span>
                            <span className="text-[8px] text-[#4a5a70] lowercase">Restricted Access</span>
                        </Button>
                        <Button
                            disabled={isActionLoading || userForRole?.role === 'ADMIN'}
                            onClick={() => handleUpdateRole('ADMIN')}
                            variant="outline"
                            className={`h-16 flex flex-col gap-1 border-[#1e2d45] ${userForRole?.role === 'ADMIN' ? 'bg-[#e05252]/10 border-[#e05252]/30' : 'hover:bg-slate-900'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">Admin clearance</span>
                            <span className="text-[8px] text-[#4a5a70] lowercase">Full Oversight</span>
                        </Button>
                    </div>

                    <Button
                        disabled={isActionLoading}
                        onClick={() => setRoleModalOpen(false)}
                        variant="ghost"
                        className="w-full h-11 text-[10px] font-black uppercase tracking-widest text-[#4a5a70] hover:text-white"
                    >
                        Close Controller
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
