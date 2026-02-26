"use client"

import { useEffect, useState } from"react"
import Link from"next/link"
import { Card, CardContent } from"@/components/ui/card"
import { Button } from"@/components/ui/button"
import { Calendar, DollarSign, Loader2, Plus, ArrowRight, Layers, Trash2, Edit3, ShieldAlert, Save, Sparkles, Package2 } from"lucide-react"
import api from"@/lib/api"
import { Badge } from"@/components/ui/badge"
import { useToast } from"@/context/ToastContext"
import { Modal } from"@/components/ui/modal"
import { Input } from"@/components/ui/input"
import { Label } from"@/components/ui/label"
import { Textarea } from"@/components/ui/textarea"

interface Package {
 id: string
 title: string
 description: string | null
 price: number
 createdAt: string
}

export default function AdminPackagesPage() {
 const [packages, setPackages] = useState<Package[]>([])
 const [isLoading, setIsLoading] = useState(true)
 const [isActionLoading, setIsActionLoading] = useState(false)

 // Deletion State
 const [deleteModalOpen, setDeleteModalOpen] = useState(false)
 const [packageToDelete, setPackageToDelete] = useState<Package | null>(null)

 // Edit State
 const [editModalOpen, setEditModalOpen] = useState(false)
 const [packageToEdit, setPackageToEdit] = useState<Package | null>(null)
 const [editFormData, setEditFormData] = useState({
 title:"",
 price:"",
 description:""
 })

 const { showToast } = useToast()

 useEffect(() => {
 fetchPackages()
 }, [])

 const fetchPackages = async () => {
 try {
 const response = await api.get('/packages')
 setPackages(response.data)
 } catch (error) {
 console.error("Failed to fetch packages", error)
 showToast("Failed to compile package registry","error")
 } finally {
 setIsLoading(false)
 }
 }

 const handleDeletePackage = async () => {
 if (!packageToDelete) return
 setIsActionLoading(true)
 try {
 await api.delete(`/packages/${packageToDelete.id}`)
 showToast(`Package"${packageToDelete.title}"purged successfully`,"success")
 setPackages(packages.filter(p => p.id !== packageToDelete.id))
 setDeleteModalOpen(false)
 setPackageToDelete(null)
 } catch (error: any) {
 showToast(error.response?.data?.message ||"Purge operation failed","error")
 } finally {
 setIsActionLoading(false)
 }
 }

 const handleOpenEdit = (pkg: Package) => {
 setPackageToEdit(pkg)
 setEditFormData({
 title: pkg.title,
 price: pkg.price.toString(),
 description: pkg.description ||""
 })
 setEditModalOpen(true)
 }

 const handleUpdatePackage = async (e: React.FormEvent) => {
 e.preventDefault()
 if (!packageToEdit) return
 setIsActionLoading(true)
 try {
 const response = await api.patch(`/packages/${packageToEdit.id}`, {
 ...editFormData,
 price: parseFloat(editFormData.price)
 })
 showToast("Package details updated successfully","success")
 setPackages(packages.map(p => p.id === packageToEdit.id ? response.data : p))
 setEditModalOpen(false)
 setPackageToEdit(null)
 } catch (error: any) {
 showToast(error.response?.data?.message ||"Failed to update package","error")
 } finally {
 setIsActionLoading(false)
 }
 }

 if (isLoading) {
 return (
 <div className="flex flex-col items-center justify-center h-[500px] gap-4">
 <Loader2 className="h-10 w-10 animate-spin text-accent"/>
 <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Compiling Package Registry...</p>
 </div>
 )
 }

 return (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
 <div className="space-y-2">
 <div className="flex items-center gap-3">
 <Package2 className="h-7 w-7 text-accent"/>
 <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Package Management</h2>
 </div>
 <p className="text-sm text-text-secondary font-medium">Configure and manage multi-asset study bundles on the marketplace.</p>
 </div>
 <Link href="/dashboard/packages/create">
 <Button className="h-12 px-6 bg-accent hover:bg-accent text-background font-black uppercase tracking-widest text-[10px] gap-3 shadow-none shadow-none border-none transition-all hover:scale-[1.02] active:scale-[0.98]">
 <Plus className="h-4 w-4"/>
 Assemble New Package
 </Button>
 </Link>
 </div>

 <div className="grid gap-5">
 {packages.map((pkg) => (
 <Card key={pkg.id} className="group border-border bg-surface hover:border-accent/40 transition-all duration-300 overflow-hidden shadow-none">
 <CardContent className="p-0">
 <div className="flex flex-col md:flex-row">
 {/* Visual Indicator */}
 <div className="p-8 md:w-40 bg-background border-b md:border-b-0 md:border-r border-border/50 flex items-center justify-center shrink-0">
 <div className="h-16 w-16 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-inner group-hover:border-accent/40 transition-all duration-500 group-hover:scale-110">
 <Layers className="h-7 w-7 text-accent"/>
 </div>
 </div>

 {/* Content */}
 <div className="p-8 flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
 <div className="space-y-2 min-w-0">
 <div className="flex items-center gap-4">
 <h3 className="text-xl font-black text-text-primary group-hover:text-accent transition-colors uppercase tracking-tight truncate">
 {pkg.title}
 </h3>
 <Badge className="bg-accent text-background border-accent/40 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5">Bundle</Badge>
 </div>
 <p className="text-sm text-text-secondary font-medium line-clamp-1 opacity-80 max-w-2xl">
 {pkg.description ||"No description provided for this multi-asset package."}
 </p>
 <div className="flex flex-wrap items-center gap-6 pt-4">
 <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
 <Calendar className="h-3.5 w-3.5 text-accent"/>
 Assembled: {new Date(pkg.createdAt).toLocaleDateString()}
 </div>
 <div className="flex items-center gap-2 text-[10px] font-black text-background uppercase tracking-widest bg-accent px-3 py-1.5 rounded-lg border border-accent/40">
 <DollarSign className="h-3.5 w-3.5"/>
 Bundle Value: ₹{pkg.price}
 </div>
 <div className="text-[10px] font-black text-text-muted uppercase tracking-widest px-3 py-1 bg-background rounded-lg border border-border">
 PKG-ID: {pkg.id.substring(0, 8)}
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-3 shrink-0">
 <Link href={`/dashboard/packages/${pkg.id}`} className="flex-1 lg:flex-none">
 <Button className="w-full lg:w-auto h-11 bg-accent border border-accent/40 text-background hover:bg-accent hover:text-background transition-all gap-3 text-[10px] font-black uppercase tracking-[0.2em] px-8 rounded-xl">
 Configure
 <ArrowRight className="h-4 w-4"/>
 </Button>
 </Link>
 <Button
 onClick={() => handleOpenEdit(pkg)}
 variant="outline"
 className="h-11 w-11 p-0 border-border text-text-muted hover:text-text-primary hover:bg-surface-raised rounded-xl"
 >
 <Edit3 className="h-4 w-4"/>
 </Button>
 <Button
 onClick={() => {
 setPackageToDelete(pkg);
 setDeleteModalOpen(true);
 }}
 variant="outline"
 className="h-11 w-11 p-0 border-border text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl"
 >
 <Trash2 className="h-4 w-4"/>
 </Button>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}

 {packages.length === 0 && (
 <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[2.5rem] border-2 border-dashed border-border bg-surface">
 <Package2 className="h-16 w-16 text-text-muted mb-6"/>
 <h3 className="text-xl font-black text-text-secondary uppercase tracking-tighter">No Packages</h3>
 <p className="text-xs text-text-muted font-bold mt-2 uppercase tracking-widest">Multi-asset bundles allow for high-value strategic deployments.</p>
 <Link href="/dashboard/packages/create"className="mt-10">
 <Button className="bg-accent text-background font-black uppercase text-xs tracking-[0.2em] h-14 px-10 rounded-2xl shadow-none shadow-none">Assemble First Package</Button>
 </Link>
 </div>
 )}
 </div>

 {/* Delete Modal */}
 <Modal
 isOpen={deleteModalOpen}
 onClose={() => !isActionLoading && setDeleteModalOpen(false)}
 title="Package Dissolution"
 >
 <div className="space-y-6 pt-2">
 <div className="flex items-center gap-5 p-5 rounded-2xl bg-accent/10 border border-accent/30">
 <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
 <ShieldAlert className="h-6 w-6 text-accent"/>
 </div>
 <p className="text-xs font-bold text-accent leading-relaxed uppercase tracking-tight">
 Warning: You are about to dissolve bundle <span className="text-text-primary underline font-black">{packageToDelete?.title}</span>. This will revoke future acquisitions but preserve historical orders.
 </p>
 </div>

 <div className="flex items-center gap-3 pt-2">
 <Button
 disabled={isActionLoading}
 onClick={() => setDeleteModalOpen(false)}
 variant="ghost"
 className="flex-1 h-12 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
 >
 Abort
 </Button>
 <Button
 isLoading={isActionLoading}
 onClick={handleDeletePackage}
 className="flex-1 h-12 bg-accent/10 hover:bg-accent/10 text-text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-none shadow-none"
 >
 Confirm Dissolution
 </Button>
 </div>
 </div>
 </Modal>

 {/* Edit Modal */}
 <Modal
 isOpen={editModalOpen}
 onClose={() => !isActionLoading && setEditModalOpen(false)}
 title="Modify Configuration"
 >
 <form onSubmit={handleUpdatePackage} className="space-y-6 pt-2">
 <div className="space-y-2.5">
 <Label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Package Title</Label>
 <Input
 value={editFormData.title}
 onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
 placeholder="Enter package name"
 className="bg-background h-12 border-border font-bold focus:ring-accent"
 required
 />
 </div>

 <div className="space-y-2.5">
 <Label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Bundle Valuation (₹)</Label>
 <Input
 type="number"
 value={editFormData.price}
 onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
 placeholder="Set package price"
 className="bg-background h-12 border-border font-bold focus:ring-accent"
 required
 />
 </div>

 <div className="space-y-2.5">
 <Label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Bundle Overview</Label>
 <Textarea
 value={editFormData.description}
 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditFormData({ ...editFormData, description: e.target.value })}
 placeholder="Describe the strategic value of this bundle..."
 className="bg-background border-border resize-none h-32 focus:ring-accent"
 />
 </div>

 <div className="flex items-center gap-3 pt-6">
 <Button
 type="button"
 disabled={isActionLoading}
 onClick={() => setEditModalOpen(false)}
 variant="ghost"
 className="flex-1 h-12 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
 >
 Cancel
 </Button>
 <Button
 type="submit"
 isLoading={isActionLoading}
 className="flex-1 h-12 bg-accent hover:bg-accent text-background text-[10px] font-black uppercase tracking-[0.2em] shadow-none shadow-none"
 >
 <Save className="mr-2 h-4 w-4"/>
 Save Configuration
 </Button>
 </div>
 </form>
 </Modal>
 </div>
 )
}
