"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileIcon, Loader2, CheckCircle2, ShieldAlert, AlertCircle, Sparkles } from "lucide-react"
import api from "@/lib/api"

export default function UploadPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
    })

    const [files, setFiles] = useState<{
        secureFile: File | null;
        demoFile: File | null;
    }>({
        secureFile: null,
        demoFile: null,
    })

    const handleUpload = async () => {
        if (!form.title || !form.price || !files.secureFile) {
            setError("Please fill in all required fields and select the secure asset file.")
            return
        }

        setIsLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append("title", form.title)
        formData.append("price", form.price)
        formData.append("description", form.description)
        formData.append("secureFile", files.secureFile)
        if (files.demoFile) {
            formData.append("demoFile", files.demoFile)
        }

        try {
            await api.post("/materials", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            setIsSuccess(true)
            setTimeout(() => {
                router.push("/dashboard/admin-materials")
            }, 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to initiate asset deployment.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="h-24 w-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Deployment Successful</h2>
                <p className="text-[#8a9bb0] mt-3 font-medium max-w-sm">
                    The intellectual asset has been ingested, encrypted, and seeded to the sovereign network.
                </p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/10">
                    <Sparkles className="h-3 w-3" />
                    Vault Hash Verified
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1e2d45]">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Upload className="h-6 w-6 text-[#e05252]" />
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Intel Ingestion</h2>
                    </div>
                    <p className="text-sm text-[#8a9bb0] font-medium">Deploy new high-fidelity study assets to the sovereign vault.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[9px] font-black text-[#4a5a70] uppercase tracking-[0.2em]">
                    <ShieldAlert className="h-3 w-3" />
                    SECURE LINE ACTIVE
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-[#1e2d45] bg-[#0a0e1a] shadow-2xl">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-xs font-black text-[#f0f2f5] uppercase tracking-widest">Metadata Registry</h3>
                                <p className="text-[10px] text-[#4a5a70] font-bold uppercase tracking-tight">Define the core identifiers for this intellectual asset.</p>
                            </div>

                            {error && (
                                <div className="p-4 flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-xl animate-in shake duration-500">
                                    <AlertCircle className="h-4 w-4 text-[#e05252] shrink-0" />
                                    <p className="text-xs font-bold text-[#e05252] uppercase tracking-tighter">{error}</p>
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest pl-1">Material Title</label>
                                    <Input
                                        placeholder="E.G. QUANTUM ECONOMY PACK"
                                        className="bg-slate-900/50 border-[#1e2d45] h-12 text-sm font-bold text-[#f0f2f5] focus:ring-1 focus:ring-[#e05252] focus:border-[#e05252]"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest pl-1">Acquisition Price (₹)</label>
                                    <Input
                                        type="number"
                                        placeholder="499"
                                        className="bg-slate-900/50 border-[#1e2d45] h-12 text-sm font-bold text-[#f0f2f5] focus:ring-1 focus:ring-[#e05252] focus:border-[#e05252]"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest pl-1">Asset Description</label>
                                <Textarea
                                    placeholder="PROVIDE ARCHITECTURAL DETAILS ABOUT THIS MATERIAL..."
                                    className="bg-slate-900/50 border-[#1e2d45] min-h-[120px] text-sm font-medium text-[#8a9bb0] focus:ring-1 focus:ring-[#e05252] focus:border-[#e05252] resize-none"
                                    value={form.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest pl-1">Secure Core (PDF)</label>
                                    <div className="relative border-2 border-dashed border-[#1e2d45] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#e05252]/50 hover:bg-[#e05252]/5 transition-all group">
                                        <Input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const file = e.target.files?.[0] || null;
                                                setFiles(prev => ({ ...prev, secureFile: file }));
                                            }}
                                        />
                                        <FileIcon className={`h-10 w-10 mb-3 transition-colors ${files.secureFile ? 'text-[#e05252]' : 'text-[#1e2d45]'}`} />
                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4a5a70] group-hover:text-white transition-colors text-center px-4">
                                            {files.secureFile ? files.secureFile.name : 'UPLOAD SECURE ASSET'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest pl-1">Demo Preview (PDF)</label>
                                    <div className="relative border-2 border-dashed border-[#1e2d45] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all group">
                                        <Input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const file = e.target.files?.[0] || null;
                                                setFiles(prev => ({ ...prev, demoFile: file }));
                                            }}
                                        />
                                        <FileIcon className={`h-10 w-10 mb-3 transition-colors ${files.demoFile ? 'text-[#c9a84c]' : 'text-[#1e2d45]'}`} />
                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4a5a70] group-hover:text-white transition-colors text-center px-4">
                                            {files.demoFile ? files.demoFile.name : 'UPLOAD DEMO STREAM'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-[#e05252] hover:bg-[#ff6b6b] text-white font-black h-14 relative overflow-hidden group shadow-2xl shadow-red-950/40 border-none transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                                onClick={handleUpload}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
                                        <Upload className="h-5 w-5" />
                                        Initiate Deployment Protocol
                                    </span>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-[#1e2d45] bg-[#0a0e1a]/50">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xs font-black text-[#f0f2f5] uppercase tracking-widest">Protocol Rules</h3>
                            <ul className="space-y-3">
                                {[
                                    "Assets must be in PDF format for secure streaming.",
                                    "Watermarks will be applied dynamically to the secure core.",
                                    "Acquisition price is stored in integer value (INR).",
                                    "Demo streams are accessible to unverified entities."
                                ].map((rule, idx) => (
                                    <li key={idx} className="flex gap-3 text-[11px] font-medium text-[#8a9bb0] leading-relaxed">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#e05252] shrink-0 mt-1.5" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-[#1e2d45] bg-[#0a0e1a]/50">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xs font-black text-[#f0f2f5] uppercase tracking-widest">Security Warning</h3>
                            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                                <p className="text-[10px] font-bold text-[#e05252] leading-relaxed text-center uppercase tracking-tighter">
                                    DEPLOYING ASSETS TO THE SOVEREIGN NETWORK IS IRREVERSIBLE ONCE SEEDED. VERIFY ALL METADATA BEFORE INITIATION.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
