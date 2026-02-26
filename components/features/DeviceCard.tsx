"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from"@/components/ui/card"
import { Button } from"@/components/ui/button"
import { Laptop, Smartphone, Globe, LogOut } from"lucide-react"
import { Badge } from"@/components/ui/badge"
import { cn } from"@/lib/utils"

interface DeviceProps {
 id: string
 name: string
 type:"Desktop"|"Mobile"|"Tablet"
 location: string
 lastActive: string
 isCurrent?: boolean
}

interface DeviceCardProps {
 device: DeviceProps
 onRevoke?: (id: string) => void
 isLoading?: boolean
}

export function DeviceCard({ device, onRevoke, isLoading }: DeviceCardProps) {
 const Icon = device.type ==="Desktop"? Laptop : device.type ==="Mobile"? Smartphone : Globe

 return (
 <Card className={`border-border bg-surface overflow-hidden shadow-none ${device.isCurrent ?"border-accent/30 ring-1 ring-accent/20":""}`}>
 <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-4">
 <div className="flex items-center gap-3 min-w-0 flex-1">
 <div className={`p-2 rounded-lg shrink-0 ${device.isCurrent ?"bg-accent/10 text-accent border border-accent/20":"bg-surface-raised text-text-secondary"}`}>
 <Icon className="h-5 w-5"/>
 </div>
 <div className="min-w-0 flex-1">
 <CardTitle className="text-base font-medium text-text-primary truncate"title={device.name}>
 {device.name}
 </CardTitle>
 <CardDescription className="text-xs truncate">
 {device.location} • {device.lastActive}
 </CardDescription>
 </div>
 </div>
 {device.isCurrent && (
 <Badge variant="success"className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shrink-0 whitespace-nowrap">
 Active Now
 </Badge>
 )}
 </CardHeader>
 <CardContent className="pt-4">
 <div className="text-xs text-text-secondary">
 IP Address: 192.168.1.***
 </div>
 </CardContent>
 {!device.isCurrent && (
 <CardFooter>
 <Button
 variant="ghost"
 size="sm"
 className="w-full text-red-400 hover:bg-red-950/30 hover:text-red-300"
 onClick={() => onRevoke?.(device.id)}
 disabled={isLoading}
 >
 {isLoading ? (
 <div className="h-4 w-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin mr-2"/>
 ) : (
 <LogOut className="mr-2 h-4 w-4"/>
 )}
 Revoke Access
 </Button>
 </CardFooter>
 )}
 </Card>
 )
}
