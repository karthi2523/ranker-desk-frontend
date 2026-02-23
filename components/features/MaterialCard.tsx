"use client"

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, FileText, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"

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
        <Card className="group flex flex-col overflow-hidden bg-slate-900/50 border-slate-800 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_theme(colors.indigo.500/0.1)]">
            <div className={`aspect-video w-full ${type === 'package' ? 'bg-emerald-950/20' : 'bg-slate-900'} relative flex items-center justify-center border-b border-slate-800 overflow-hidden`}>
                {/* Background Pattern */}
                <div className={`absolute inset-0 opacity-[0.03] bg-[radial-gradient(${type === 'package' ? '#10b981' : '#4f46e5'}_1px,transparent_1px)] [background-size:16px_16px]`} />

                <FileText className={`h-12 w-12 text-slate-700 transition-transform duration-500 group-hover:scale-110 ${type === 'package' ? 'group-hover:text-emerald-500/50' : 'group-hover:text-indigo-500/50'}`} />

                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    <Badge className={isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-slate-800 text-slate-400"}>
                        {isActive ? (
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-3 w-3" />
                                <span>Secured Access</span>
                            </div>
                        ) : "Expired"}
                    </Badge>
                </div>
            </div>

            <CardHeader className="space-y-1 p-5">
                <CardTitle className="text-base font-bold text-white transition-colors group-hover:text-indigo-400 line-clamp-1">{title}</CardTitle>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <Zap className="h-3 w-3 text-amber-500/50" />
                    <span>Purchased {purchasedDate}</span>
                </div>
            </CardHeader>

            <CardFooter className="p-5 pt-0 mt-auto">
                {isActive ? (
                    <Link href={type === 'package' ? `/vault/package/${id}` : `/vault/${id}`} className="w-full">
                        <Button className={`w-full h-11 ${type === 'package' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'} text-white font-bold gap-2 rounded-xl shadow-lg active:scale-[0.98] transition-all`}>
                            <Unlock className="h-4 w-4" />
                            {type === 'package' ? 'Open Package' : 'Enter Secure Vault'}
                        </Button>
                    </Link>
                ) : (
                    <Button variant="secondary" disabled className="w-full h-11 gap-2 rounded-xl bg-slate-800/50 text-slate-500 border-slate-700">
                        <Lock className="h-4 w-4" />
                        License Terminated
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
