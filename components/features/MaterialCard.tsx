"use client"

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, FileText } from "lucide-react"
import Link from "next/link"

interface MaterialCardProps {
    id: string
    title: string
    purchasedDate: string
    isActive: boolean
    thumbnail?: string
}

export function MaterialCard({ id, title, purchasedDate, isActive }: MaterialCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:border-indigo-500/50">
            <div className="aspect-video w-full bg-slate-900 relative flex items-center justify-center border-b border-slate-800">
                <FileText className="h-12 w-12 text-slate-700" />
                <div className="absolute top-2 right-2">
                    <Badge variant={isActive ? "success" : "secondary"}>
                        {isActive ? "Active License" : "Expired"}
                    </Badge>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1">{title}</CardTitle>
                <p className="text-xs text-slate-400">Purchased: {purchasedDate}</p>
            </CardHeader>
            <CardFooter className="mt-auto pt-0">
                {isActive ? (
                    <Link href={`/vault/${id}`} className="w-full">
                        <Button className="w-full gap-2">
                            <Unlock className="h-4 w-4" />
                            Open in Vault
                        </Button>
                    </Link>
                ) : (
                    <Button variant="secondary" disabled className="w-full gap-2">
                        <Lock className="h-4 w-4" />
                        License Expired
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
