"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, CheckCircle2, LayoutDashboard, FileText } from "lucide-react"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

interface Material {
    id: string
    title: string
    price: number
}

export default function CreatePackagePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [availableMaterials, setAvailableMaterials] = useState<Material[]>([])

    // Using a Set for efficient toggling
    const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<string>>(new Set())

    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
    })

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await api.get('/materials')
                setAvailableMaterials(response.data)
            } catch (error) {
                console.error("Failed to fetch materials", error)
                setError("Failed to load available materials.")
            } finally {
                setIsFetching(false)
            }
        }
        fetchMaterials()
    }, [])

    const toggleMaterial = (id: string) => {
        const newSet = new Set(selectedMaterialIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedMaterialIds(newSet)
    }

    const handleCreate = async () => {
        if (!form.title || !form.price || selectedMaterialIds.size === 0) {
            setError("Please provide title, price, and select at least one material.")
            return
        }

        setIsLoading(true)
        setError(null)

        const payload = {
            title: form.title,
            price: form.price,
            description: form.description,
            materialIds: Array.from(selectedMaterialIds)
        }

        try {
            await api.post("/packages", payload)
            setIsSuccess(true)
            setTimeout(() => {
                router.push("/dashboard/packages")
            }, 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create package.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white">Package Created!</h2>
                <p className="text-slate-400 mt-2">The package has been successfully deployed to the store.</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Package Creator</h2>
                <p className="text-sm text-slate-400">Bundle existing assets into a new secure package.</p>
            </div>

            <Card className="border-red-900/20 bg-slate-900/50 backdrop-blur-md">
                <CardHeader>
                    <CardTitle>Package Configuration</CardTitle>
                    <CardDescription>
                        Set pricing and associate multiple protected resources.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Package Title</label>
                            <Input
                                placeholder="e.g. Master CSAT Bundle"
                                className="bg-slate-950/50 border-slate-800"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Package Price (INR)</label>
                            <Input
                                type="number"
                                placeholder="999"
                                className="bg-slate-950/50 border-slate-800"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Description</label>
                        <Textarea
                            placeholder="Provide details about the package content..."
                            className="bg-slate-950/50 border-slate-800 min-h-[100px]"
                            value={form.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                                Select Assets
                            </label>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                Selected: {selectedMaterialIds.size}
                            </span>
                        </div>

                        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50 max-h-64 overflow-y-auto w-full p-2">
                            {isFetching ? (
                                <div className="p-8 text-center flex flex-col items-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-500 mb-2" />
                                    <span className="text-sm text-slate-400">Loading assets...</span>
                                </div>
                            ) : availableMaterials.length === 0 ? (
                                <div className="p-8 text-center">
                                    <span className="text-sm text-slate-400">No materials available. Please upload some first.</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {availableMaterials.map((mat) => {
                                        const isSelected = selectedMaterialIds.has(mat.id)
                                        return (
                                            <div
                                                key={mat.id}
                                                onClick={() => toggleMaterial(mat.id)}
                                                className={cn(
                                                    "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3",
                                                    isSelected
                                                        ? "bg-indigo-500/10 border-indigo-500/50 shadow-[inset_0_0_15px_-5px_rgba(79,70,229,0.3)]"
                                                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 mt-0.5 shrink-0 rounded border flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-600"
                                                )}>
                                                    {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "text-sm font-semibold truncate",
                                                        isSelected ? "text-indigo-400" : "text-slate-200"
                                                    )}>
                                                        {mat.title}
                                                    </p>
                                                    <p className="text-xs text-emerald-400 font-bold mt-1">
                                                        ₹{mat.price}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 relative overflow-hidden group shadow-xl shadow-red-900/20 disabled:opacity-50 mt-4"
                        onClick={handleCreate}
                        disabled={isLoading || selectedMaterialIds.size === 0}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Publish Package
                            </span>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
