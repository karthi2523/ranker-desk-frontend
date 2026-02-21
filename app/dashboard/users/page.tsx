"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Shield, Calendar, Loader2 } from "lucide-react"
import api from "@/lib/api"

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

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users')
            setUsers(response.data)
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Personnel Registry</h2>
                <p className="text-slate-400">Manage all registered entities and their authorization levels.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user.id} className="border-red-900/20 bg-slate-900/50 backdrop-blur-md hover:border-red-500/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">
                                {user.name || "Unnamed User"}
                            </CardTitle>
                            <Shield className={`h-4 w-4 ${user.role === 'ADMIN' ? 'text-red-500' : 'text-slate-500'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center text-xs text-slate-400 gap-2">
                                    <Mail className="h-3 w-3" />
                                    {user.email}
                                </div>
                                <div className="flex items-center text-xs text-slate-400 gap-2">
                                    <Calendar className="h-3 w-3" />
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN'
                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
