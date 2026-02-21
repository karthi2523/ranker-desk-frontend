"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileIcon, Loader2, CheckCircle2 } from "lucide-react"
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
            setError("Please fill in all required fields and select the secure file.")
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
                router.push("/dashboard")
            }, 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to upload material")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white">Upload Successful!</h2>
                <p className="text-slate-400 mt-2">The material has been securely added to the vault.</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Intel Ingestion</h2>
                <p className="text-sm text-slate-400">Deploy new high-fidelity study assets to the sovereign network.</p>
            </div>

            <Card className="border-red-900/20 bg-slate-900/50 backdrop-blur-md">
                <CardHeader>
                    <CardTitle>Asset Deployment Protocol</CardTitle>
                    <CardDescription>
                        Register a new securely encrypted PDF and optional demo preview.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Material Title</label>
                        <Input
                            placeholder="e.g. UPSC CSAT Mastery Guide"
                            className="bg-slate-950/50 border-slate-800"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Acquisition Price (INR)</label>
                        <Input
                            type="number"
                            placeholder="499"
                            className="bg-slate-950/50 border-slate-800"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Asset Description</label>
                        <Textarea
                            placeholder="Provide details about the material content, scope, and target exams..."
                            className="bg-slate-950/50 border-slate-800 min-h-[100px]"
                            value={form.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                                <Upload className="h-3 w-3 text-red-500" />
                                Secure Asset (PDF)
                            </label>
                            <div className="relative border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all bg-slate-950/30 group">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0] || null;
                                        setFiles(prev => ({ ...prev, secureFile: file }));
                                    }}
                                />
                                <FileIcon className={`h-8 w-8 mb-2 ${files.secureFile ? 'text-indigo-400' : 'text-slate-600'}`} />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">
                                    {files.secureFile ? files.secureFile.name : 'Select Secure PDF'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                                <FileIcon className="h-3 w-3 text-emerald-500" />
                                Demo Preview (PDF)
                            </label>
                            <div className="relative border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all bg-slate-950/30 group">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0] || null;
                                        setFiles(prev => ({ ...prev, demoFile: file }));
                                    }}
                                />
                                <FileIcon className={`h-8 w-8 mb-2 ${files.demoFile ? 'text-emerald-400' : 'text-slate-600'}`} />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-emerald-400 transition-colors">
                                    {files.demoFile ? files.demoFile.name : 'Select Demo PDF'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 relative overflow-hidden group shadow-xl shadow-red-900/20 disabled:opacity-50"
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Initiate Deployment
                            </span>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

