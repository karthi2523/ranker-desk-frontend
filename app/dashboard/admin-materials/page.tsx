"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, DollarSign, Loader2, Plus, Ghost, Eye, Trash2, Edit3, ShieldAlert, Save, Search } from "lucide-react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/context/ToastContext"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"

interface Material {
    id: string
    title: string
    description: string | null
    price: number
    demoPath: string | null
    createdAt: string
}

export default function AdminMaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)

    // Deletion State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null)

    // Edit State
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null)
    const [editFormData, setEditFormData] = useState({
        title: "",
        price: "",
        description: ""
    })

    const { showToast } = useToast()

    useEffect(() => {
        fetchMaterials()
    }, [])

    const fetchMaterials = async () => {
        try {
            const response = await api.get('/materials')
            setMaterials(response.data)
        } catch (error) {
            console.error("Failed to fetch materials", error)
            showToast("Failed to scan asset inventory", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteMaterial = async () => {
        if (!materialToDelete) return
        setIsActionLoading(true)
        try {
            await api.delete(`/materials/${materialToDelete.id}`)
            showToast(`Asset"${materialToDelete.title}"purged from inventory`, "success")
            setMaterials(materials.filter(m => m.id !== materialToDelete.id))
            setDeleteModalOpen(false)
            setMaterialToDelete(null)
        } catch (error: any) {
            showToast(error.response?.data?.message || "Purge operation failed", "error")
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleOpenEdit = (material: Material) => {
        setMaterialToEdit(material)
        setEditFormData({
            title: material.title,
            price: material.price.toString(),
            description: material.description || ""
        })
        setEditModalOpen(true)
    }

    const handleUpdateMaterial = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!materialToEdit) return
        setIsActionLoading(true)
        try {
            const response = await api.patch(`/materials/${materialToEdit.id}`, {
                ...editFormData,
                price: parseFloat(editFormData.price)
            })
            showToast("Asset metadata updated successfully", "success")
            setMaterials(materials.map(m => m.id === materialToEdit.id ? response.data : m))
            setEditModalOpen(false)
            setMaterialToEdit(null)
        } catch (error: any) {
            showToast(error.response?.data?.message || "Failed to update asset", "error")
        } finally {
            setIsActionLoading(false)
        }
    }

    const searchParams = useSearchParams()
    const searchString = searchParams.get('search')?.toLowerCase() || ""

    const filteredMaterials = (materials || []).filter(m =>
        m.title.toLowerCase().includes(searchString) ||
        (m.description && m.description.toLowerCase().includes(searchString))
    )

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Scanning Asset Inventory...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-accent" />
                        <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Asset Inventory</h2>
                    </div>
                    <p className="text-sm text-text-secondary font-medium">Review, inspect, and manage all deployed intellectual assets on the sovereign network.</p>
                </div>
                <Link href="/dashboard/upload">
                    <Button className="h-12 px-6 bg-accent hover:bg-accent text-background font-black uppercase tracking-widest text-[10px] gap-2 shadow-none shadow-none border-none transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Plus className="h-4 w-4" />
                        Deploy New Asset
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {filteredMaterials.map((material) => (
                    <Card key={material.id} className="group border-border bg-surface hover:border-accent/40 transition-all duration-300 overflow-hidden shadow-none">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                {/* Visual Indicator */}
                                <div className="p-6 md:w-32 bg-surface border-b md:border-b-0 md:border-r border-border/50 flex items-center justify-center shrink-0">
                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-xl bg-background border border-border flex items-center justify-center shadow-inner group-hover:border-accent/40 transition-colors">
                                            <FileText className="h-6 w-6 text-accent" />
                                        </div>
                                        {material.demoPath && (
                                            <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-accent flex items-center justify-center border-2 border-background" title="Demo Available">
                                                <Ghost className="h-2.5 w-2.5 text-text-primary" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-black text-text-primary group-hover:text-accent transition-colors uppercase tracking-tight truncate">
                                                {material.title}
                                            </h3>
                                            <Badge className="bg-background text-text-muted border-border text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0">PDF</Badge>
                                        </div>
                                        <p className="text-xs text-text-secondary font-medium line-clamp-1 opacity-70">
                                            {material.description || "No description provided for this secure asset."}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 pt-3">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-text-muted uppercase tracking-widest">
                                                <Calendar className="h-3 w-3 text-accent" />
                                                Seeded: {new Date(material.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-background uppercase tracking-widest bg-accent px-2.5 py-1 rounded border border-accent/40">
                                                <DollarSign className="h-3 w-3" />
                                                Valuation: ₹{material.price}
                                            </div>
                                            <div className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                                                ID: {material.id.substring(0, 8)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            variant="secondary"
                                            className="h-10 text-[10px] font-black uppercase tracking-widest border border-border hover:bg-surface gap-2 text-text-primary"
                                            onClick={() => {
                                                const url = `/api/materials/${material.id}/demo`;
                                                window.open(url, '_blank');
                                            }}
                                            disabled={!material.demoPath}
                                        >
                                            <Ghost className="h-3.5 w-3.5" />
                                            Demo
                                        </Button>
                                        <Link href={`/vault/${material.id}`}>
                                            <Button className="h-10 bg-accent border border-accent/40 text-background hover:bg-accent hover:text-background transition-all gap-2 text-[10px] font-black uppercase tracking-widest px-5">
                                                <Eye className="h-3.5 w-3.5" />
                                                Inspect
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => handleOpenEdit(material)}
                                            variant="outline"
                                            className="h-10 w-10 p-0 border-border text-text-muted hover:text-background hover:bg-accent"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setMaterialToDelete(material);
                                                setDeleteModalOpen(true);
                                            }}
                                            variant="outline"
                                            className="h-10 w-10 p-0 border-border text-text-muted hover:text-accent hover:bg-accent/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {materials.length > 0 && filteredMaterials.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[300px] rounded-2xl border-2 border-dashed border-border bg-surface">
                        <Search className="h-10 w-10 text-text-muted mb-4" />
                        <h3 className="text-lg font-black text-text-secondary uppercase tracking-tighter">No assets found</h3>
                        <p className="text-xs text-text-muted font-bold mt-1">Your search for"{searchString}"yielded no matching deployed assets.</p>
                    </div>
                )}

                {materials.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[300px] rounded-2xl border-2 border-dashed border-border bg-surface">
                        <FileText className="h-10 w-20 text-text-muted mb-4" />
                        <h3 className="text-lg font-black text-text-secondary uppercase tracking-tighter">Inventory Empty</h3>
                        <p className="text-xs text-text-muted font-bold mt-1">No secure assets have been deployed to the vault yet.</p>
                        <Link href="/dashboard/upload" className="mt-6">
                            <Button className="bg-accent text-background font-black uppercase text-[10px] tracking-widest h-10 px-8">Initiate Deployment</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => !isActionLoading && setDeleteModalOpen(false)}
                title="Asset Purge Authorization"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/10 border border-accent/30">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <ShieldAlert className="h-5 w-5 text-accent" />
                        </div>
                        <p className="text-xs font-bold text-accent leading-relaxed uppercase tracking-tight">
                            Warning: You are about to permanently purge <span className="text-text-primary underline">{materialToDelete?.title}</span> from the sovereign vault. This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            disabled={isActionLoading}
                            onClick={() => setDeleteModalOpen(false)}
                            variant="ghost"
                            className="flex-1 h-11 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
                        >
                            Abort
                        </Button>
                        <Button
                            disabled={isActionLoading}
                            onClick={handleDeleteMaterial}
                            className="flex-1 h-11 bg-accent/10 hover:bg-accent/10 text-text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-none shadow-none"
                        >
                            {isActionLoading ? "Purging Asset..." : "Confirm Purge"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => !isActionLoading && setEditModalOpen(false)}
                title="Update Asset Metadata"
            >
                <form onSubmit={handleUpdateMaterial} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Asset Title</Label>
                        <Input
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                            placeholder="Enter asset title"
                            className="bg-surface"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Valuation (₹)</Label>
                        <Input
                            type="number"
                            value={editFormData.price}
                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                            placeholder="Set asset price"
                            className="bg-surface"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Asset Intel / Description</Label>
                        <Textarea
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            placeholder="Describe the asset content..."
                            className="bg-surface resize-none h-32"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <Button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => setEditModalOpen(false)}
                            variant="ghost"
                            className="flex-1 h-11 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isActionLoading}
                            className="flex-1 h-11 bg-accent hover:bg-accent text-background text-[10px] font-black uppercase tracking-[0.2em] shadow-none shadow-none"
                        >
                            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                                <Save className="mr-2 h-4 w-4" />
                                Store Changes
                            </>}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
