"use client"

import { useEffect, useState } from"react"
import { useRouter } from"next/navigation"
import { ShieldCheck, ShieldAlert, PackageIcon, Target } from"lucide-react"
import { Button } from"@/components/ui/button"
import { Card, CardContent } from"@/components/ui/card"
import api from"@/lib/api"
import { useAuth } from"@/context/AuthContext"

interface PackageMaterial {
 material: {
 id: string
 title: string
 description: string | null
 }
}

interface Package {
 id: string
 title: string
 description: string | null
 price: number
 hasAccess: boolean
 packageMaterials: PackageMaterial[]
}

export function PackageViewer({ packageId }: { packageId: string }) {
 const router = useRouter()
 const { user } = useAuth()
 const [pkg, setPkg] = useState<Package | null>(null)
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 if (packageId) {
 fetchPackage()
 }
 }, [packageId])

 const fetchPackage = async () => {
 try {
 setIsLoading(true)
 const response = await api.get(`/packages/${packageId}`)
 setPkg(response.data)
 } catch (error) {
 console.error("Package access error:", error)
 } finally {
 setIsLoading(false)
 }
 }

 if (!user) return null

 if (isLoading) {
 return (
 <div className="relative h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center">
 <div className="flex flex-col items-center gap-4">
 <PackageIcon className="h-10 w-10 animate-bounce text-accent"/>
 <p className="text-sm font-bold text-text-secondary tracking-widest uppercase animate-pulse">
 Unpacking Secure Vault...
 </p>
 </div>
 </div>
 )
 }

 return (
 <div className="relative min-h-screen w-full bg-background flex flex-col">
 {/* Top Warning Bar */}
 <div className="h-10 md:h-8 bg-accent/10 border-b border-accent/20 flex items-center justify-between px-4 md:px-6 text-[9px] md:text-[10px] font-bold tracking-widest md:tracking-[0.2em] text-accent/80 uppercase select-none">
 <div className="flex items-center gap-2">
 <ShieldCheck className="h-3 w-3 shrink-0"/>
 <span className="hidden sm:inline">Package Vault Content Active</span>
 <span className="sm:hidden text-[8px]">SECURE</span>
 </div>
 <div className="flex items-center gap-2 overflow-hidden truncate">
 <span className="hidden sm:inline text-text-muted uppercase">Audit:</span>
 {user.email}
 </div>
 </div>

 {/* Premium Viewer Toolbar */}
 <div className="h-16 md:h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 z-40 sticky top-0">
 <div className="flex items-center gap-3 overflow-hidden">
 <div className="flex flex-col min-w-0">
 <span className="text-[10px] md:text-xs font-black text-text-primary truncate">{pkg?.title}</span>
 <span className="text-[8px] md:text-[10px] text-text-muted font-bold uppercase tracking-tighter">Digital Asset Package</span>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-full border border-accent/20">
 <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-accent"/>
 <span className="text-[7px] md:text-[9px] font-black text-accent uppercase whitespace-nowrap">Access Granted</span>
 </div>
 <Button variant="ghost"size="sm"className="h-8 text-text-secondary hover:text-text-primary text-[10px] hidden sm:flex"onClick={() => router.push('/dashboard/materials')}>
 Exit Package
 </Button>
 </div>
 </div>

 {/* Main Content */}
 <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
 {pkg && pkg.hasAccess ? (
 <div className="space-y-6">
 <div className="mb-8">
 <h1 className="text-3xl font-black text-text-primary mb-2 tracking-tight uppercase">{pkg.title}</h1>
 <p className="text-text-secondary max-w-2xl">{pkg.description}</p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
 {pkg.packageMaterials.map((item, idx) => (
 <Card key={idx} className="group relative overflow-hidden bg-surface border-border transition-all duration-300 hover:border-accent/50 hover:shadow-none">
 {/* Background Pattern */}
 <div className="absolute inset-0 opacity-[0.03] bg-surface [background-size:16px_16px]"/>

 <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
 <div className="h-12 w-12 rounded-2xl bg-background flex items-center justify-center shadow-inner border border-border group-hover:border-accent/30 transition-colors mb-4">
 <Target className="h-6 w-6 text-accent/50 group-hover:text-accent transition-colors"/>
 </div>
 <h3 className="text-sm font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">{item.material.title}</h3>
 <p className="text-xs text-text-muted line-clamp-2 mb-6">{item.material.description || 'Secure material'}</p>

 <Button
 onClick={() => router.push(`/vault/${item.material.id}`)}
 className="w-full bg-accent-hover hover:bg-accent text-text-primary font-bold text-xs uppercase tracking-widest gap-2 shadow-amber-900/20 shadow-none"
 >
 <ShieldCheck className="w-4 h-4"/> Open Vault
 </Button>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 ) : (
 <div className="max-w-md w-full mx-auto mt-20 p-8 rounded-3xl border border-red-500/20 bg-red-500/10 text-center">
 <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4"/>
 <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight">Access Prohibited</h3>
 <p className="text-red-400/80 mb-6 text-sm">
 Your credentials do not permit access to this secure package.
 </p>
 <Button variant="outline"className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full"onClick={() => router.push('/dashboard/materials')}>
 Return to Safety
 </Button>
 </div>
 )}
 </div>
 </div>
 )
}
