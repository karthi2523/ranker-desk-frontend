"use client"

import { Card, CardFooter, CardHeader, CardTitle } from"@/components/ui/card"
import { Badge } from"@/components/ui/badge"
import { Button } from"@/components/ui/button"
import { Lock, Unlock, FileText, ShieldCheck, Zap } from"lucide-react"
import Link from"next/link"

interface MaterialCardProps {
 id: string
 title: string
 purchasedDate: string
 isActive: boolean
 thumbnail?: string
 type?: 'material' | 'package'
}

export function MaterialCard({ id, title, purchasedDate, isActive, type = 'material' }: MaterialCardProps) {
 return (
 <Card className="group flex flex-col overflow-hidden bg-surface border-border transition-all duration-300 hover:border-accent/30 shadow-none">
 <div className={`aspect-video w-full bg-background relative flex items-center justify-center border-b border-border overflow-hidden`}>
 <FileText className="h-12 w-12 text-text-muted transition-transform duration-500 group-hover:scale-110 group-hover:text-accent/50"/>

 <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
 <Badge className={isActive ?"bg-accent/10 text-accent border-accent/20":"bg-surface-raised text-text-secondary border-border"}>
 {isActive ? (
 <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[9px]">
 <ShieldCheck className="h-3 w-3"/>
 <span>Secured Access</span>
 </div>
 ) :"Expired"}
 </Badge>
 </div>
 </div>

 <CardHeader className="space-y-1 p-5">
 <CardTitle className="text-base font-bold text-text-primary transition-colors group-hover:text-accent line-clamp-1">{title}</CardTitle>
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
 <Zap className="h-3 w-3 text-accent/50"/>
 <span>Purchased {purchasedDate}</span>
 </div>
 </CardHeader>

 <CardFooter className="p-5 pt-0 mt-auto">
 {isActive ? (
 <Link href={type === 'package' ? `/vault/package/${id}` : `/vault/${id}`} className="w-full">
 <Button className="w-full h-11 bg-accent hover:bg-accent-hover text-slate-950 font-bold gap-2 rounded-xl shadow-none transition-all">
 <Unlock className="h-4 w-4"/>
 {type === 'package' ? 'Open Package' : 'Enter Secure Vault'}
 </Button>
 </Link>
 ) : (
 <Button variant="secondary"disabled className="w-full h-11 gap-2 rounded-xl bg-surface text-text-muted border-border shadow-none">
 <Lock className="h-4 w-4"/>
 License Terminated
 </Button>
 )}
 </CardFooter>
 </Card>
 )
}
