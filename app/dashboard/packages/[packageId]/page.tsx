"use client"

import { useEffect, useState } from"react"
import { useRouter } from"next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card"
import { Button } from"@/components/ui/button"
import { ArrowLeft, PackageIcon, DollarSign, Calendar, Eye, LayoutDashboard, Target } from"lucide-react"
import api from"@/lib/api"
import Link from"next/link"

interface PackageMaterial {
 material: {
 id: string
 title: string
 description: string | null
 price: number
 }
}

interface Package {
 id: string
 title: string
 description: string | null
 price: number
 createdAt: string
 packageMaterials: PackageMaterial[]
}

export default function AdminPackageViewer({ params }: { params: { packageId: string } }) {
 const router = useRouter()
 const [pkg, setPkg] = useState<Package | null>(null)
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 if (params.packageId) {
 fetchPackage()
 }
 }, [params.packageId])

 const fetchPackage = async () => {
 try {
 setIsLoading(true)
 const response = await api.get(`/packages/${params.packageId}`)
 setPkg(response.data)
 } catch (error) {
 console.error("Failed to fetch package details", error)
 } finally {
 setIsLoading(false)
 }
 }

 if (isLoading) {
 return (
 <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
 <PackageIcon className="h-10 w-10 animate-pulse text-accent"/>
 <p className="text-text-secondary font-medium uppercase tracking-widest text-sm">Loading Package Data...</p>
 </div>
 )
 }

 if (!pkg) {
 return (
 <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
 <p className="text-accent font-bold">Package not found or access denied.</p>
 <Button variant="outline"onClick={() => router.push('/dashboard/packages')}>Return to Packages</Button>
 </div>
 )
 }

 return (
 <div className="space-y-6">
 {/* Header section with back button */}
 <div className="flex items-center gap-4 border-b border-border pb-6">
 <Button
 variant="ghost"
 size="icon"
 className="h-10 w-10 rounded-full bg-surface border border-border hover:bg-surface-raised hover:text-text-primary"
 onClick={() => router.push('/dashboard/packages')}
 >
 <ArrowLeft className="h-5 w-5"/>
 </Button>
 <div>
 <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary uppercase tracking-tighter flex items-center gap-3">
 <PackageIcon className="h-8 w-8 text-accent"/>
 Package Settings
 </h2>
 </div>
 </div>

 {/* Package Details Overview */}
 <Card className="bg-surface border-border">
 <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
 <div className="flex-1 space-y-4">
 <div>
 <h1 className="text-3xl font-black text-text-primary tracking-tight">{pkg.title}</h1>
 <p className="text-text-secondary mt-2 max-w-3xl leading-relaxed">
 {pkg.description ||"No description provided."}
 </p>
 </div>

 <div className="flex flex-wrap gap-4 pt-4">
 <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl border border-border">
 <DollarSign className="h-4 w-4 text-accent"/>
 <span className="font-bold text-text-primary">₹{pkg.price}</span>
 <span className="text-xs text-text-muted uppercase font-bold tracking-widest ml-1">Price</span>
 </div>
 <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl border border-border">
 <Calendar className="h-4 w-4 text-accent"/>
 <span className="font-bold text-text-primary">{new Date(pkg.createdAt).toLocaleDateString()}</span>
 <span className="text-xs text-text-muted uppercase font-bold tracking-widest ml-1">Created</span>
 </div>
 <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl border border-border">
 <LayoutDashboard className="h-4 w-4 text-accent"/>
 <span className="font-bold text-text-primary">{pkg.packageMaterials.length}</span>
 <span className="text-xs text-text-muted uppercase font-bold tracking-widest ml-1">Items Included</span>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Included Materials List */}
 <div className="space-y-4">
 <h3 className="text-xl font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
 <Target className="h-5 w-5 text-accent"/>
 Included Materials
 </h3>

 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
 {pkg.packageMaterials.map((item) => (
 <Card key={item.material.id} className="border-accent/40 bg-surface hover:border-accent/40 transition-all group overflow-hidden relative">
 {/* Background Pattern */}
 <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"/>

 <CardContent className="p-5 flex flex-col h-full relative z-10">
 <div className="flex items-start justify-between mb-4">
 <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-inner border border-border group-hover:border-accent/40 transition-colors">
 <Target className="h-5 w-5 text-accent group-hover:text-accent transition-colors"/>
 </div>
 <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-lg border border-border text-xs font-bold text-accent">
 ₹{item.material.price}
 </div>
 </div>
 <h4 className="text-base font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors">
 {item.material.title}
 </h4>
 <p className="text-xs text-text-muted line-clamp-2 pb-4 flex-1">
 {item.material.description ||"Secure material"}
 </p>
 </CardContent>
 </Card>
 ))}
 </div>

 {pkg.packageMaterials.length === 0 && (
 <div className="flex h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface">
 <PackageIcon className="h-10 w-10 text-text-muted mb-3"/>
 <p className="text-text-secondary">This package is currently empty.</p>
 </div>
 )}
 </div>
 </div>
 )
}
