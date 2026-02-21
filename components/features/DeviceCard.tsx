"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Laptop, Smartphone, Globe, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DeviceProps {
    id: string
    name: string
    type: "Desktop" | "Mobile" | "Tablet"
    location: string
    lastActive: string
    isCurrent?: boolean
}

export function DeviceCard({ device }: { device: DeviceProps }) {
    const Icon = device.type === "Desktop" ? Laptop : device.type === "Mobile" ? Smartphone : Globe

    return (
        <Card className={`border-slate-800 bg-slate-900/50 ${device.isCurrent ? "border-indigo-500/50 bg-indigo-500/5" : ""}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${device.isCurrent ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-400"}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-medium text-white">{device.name}</CardTitle>
                        <CardDescription className="text-xs">
                            {device.location} • {device.lastActive}
                        </CardDescription>
                    </div>
                </div>
                {device.isCurrent && (
                    <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                        Active Now
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="pt-4">
                <div className="text-xs text-slate-400">
                    IP Address: 192.168.1.***
                </div>
            </CardContent>
            {!device.isCurrent && (
                <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full text-red-400 hover:bg-red-950/30 hover:text-red-300">
                        <LogOut className="mr-2 h-4 w-4" />
                        Revoke Access
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}
