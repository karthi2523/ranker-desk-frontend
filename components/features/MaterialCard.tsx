"use client"

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, FileText, ShieldCheck } from "lucide-react"
import Link from "next/link"

interface MaterialCardProps {
    id: string
    title: string
    purchasedDate: string
    isActive: boolean
    thumbnail?: string
    type?: "material" | "package"
}

export function MaterialCard({ id, title, purchasedDate, isActive, type = "material" }: MaterialCardProps) {
    return (
        <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:border-[#c9a84c]/30">
            {/* Card image/icon area */}
            <div className="aspect-video w-full bg-[#0a0e1a] relative flex items-center justify-center border-b border-[#1e2d45]">
                <FileText className="h-10 w-10 text-[#1e2d45] group-hover:text-[#c9a84c]/30 transition-colors duration-300" />
                <div className="absolute top-3 right-3">
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? (
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                <span>Active</span>
                            </div>
                        ) : "Inactive"}
                    </Badge>
                </div>
            </div>

            <CardHeader className="space-y-1 p-5">
                <CardTitle className="text-sm transition-colors group-hover:text-[#c9a84c] line-clamp-1">{title}</CardTitle>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#4a5a70]">
                    Purchased {purchasedDate}
                </div>
            </CardHeader>

            <CardFooter className="p-5 pt-0 mt-auto">
                {isActive ? (
                    <Link href={type === "package" ? `/vault/package/${id}` : `/vault/${id}`} className="w-full">
                        <Button className="w-full gap-2 rounded-xl">
                            <Unlock className="h-4 w-4" />
                            {type === "package" ? "Open Package" : "Enter Secure Vault"}
                        </Button>
                    </Link>
                ) : (
                    <Button variant="secondary" disabled className="w-full gap-2 rounded-xl">
                        <Lock className="h-4 w-4" />
                        License Terminated
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
