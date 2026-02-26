"use client"

import { useState } from"react"
import { useRouter } from"next/navigation"
import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Textarea } from"@/components/ui/textarea"
import { Card, CardContent } from"@/components/ui/card"
import { Upload, FileIcon, Loader2, CheckCircle2, ShieldAlert, AlertCircle, Sparkles } from"lucide-react"
import api from"@/lib/api"

export default function UploadPage() {
 const router = useRouter()
 const [isLoading, setIsLoading] = useState(false)
 const [isSuccess, setIsSuccess] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const [form, setForm] = useState({
 title:"",
 price:"",
 description:"",
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
"Content-Type":"multipart/form-data",
 },
 })
 setIsSuccess(true)
 setTimeout(() => {
 router.push("/dashboard/admin-materials")
 }, 2000)
 } catch (error: any) {
 setError(error.response?.data?.message ||"Failed to initiate asset deployment.")
 } finally {
 setIsLoading(false)
 }
 }

 if (isSuccess) {
 return (
 <div className="flex flex-col items-center justify-center h-[500px] text-center animate-in fade-in zoom-in-95 duration-500">
 <div className="h-24 w-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
 <CheckCircle2 className="h-12 w-12 text-accent"/>
 </div>
 <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Deployment Successful</h2>
 <p className="text-text-secondary mt-3 font-medium max-w-sm">
 The intellectual asset has been ingested, encrypted, and seeded to the sovereign network.
 </p>
 <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-accent/10 px-4 py-2 rounded-lg border border-accent/20">
 <Sparkles className="h-3 w-3"/>
 Vault Hash Verified
 </div>
 </div>
 )
 }

 return (
 <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
 <div className="space-y-2">
 <div className="flex items-center gap-3">
 <Upload className="h-7 w-7 text-accent"/>
 <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Intel Ingestion</h2>
 </div>
 <p className="text-sm text-text-secondary font-medium">Deploy new high-fidelity study assets to the sovereign vault.</p>
 </div>
 <div className="hidden md:flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
 <ShieldAlert className="h-3.5 w-3.5"/>
 SECURE LINE ACTIVE
 </div>
 </div>

 <div className="grid gap-8 lg:grid-cols-5">
 <div className="lg:col-span-3 space-y-6">
 <Card className="border-border bg-surface shadow-none">
 <CardContent className="p-8 space-y-8">
 <div className="space-y-1">
 <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Metadata Registry</h3>
 <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight">Define the core identifiers for this intellectual asset.</p>
 </div>

 {error && (
 <div className="p-4 flex items-center gap-3 bg-accent/10 border border-accent/30 rounded-xl animate-in shake duration-500">
 <AlertCircle className="h-4 w-4 text-accent shrink-0"/>
 <p className="text-xs font-bold text-accent uppercase tracking-tighter">{error}</p>
 </div>
 )}

 <div className="grid gap-6 sm:grid-cols-2">
 <div className="space-y-2.5">
 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Material Title</label>
 <Input
 placeholder="E.G. QUANTUM ECONOMY PACK"
 className="bg-background border-border h-12 text-sm font-bold text-text-primary focus:ring-1 focus:ring-accent focus:border-accent/40"
 value={form.title}
 onChange={(e) => setForm({ ...form, title: e.target.value })}
 />
 </div>

 <div className="space-y-2.5">
 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Acquisition Price (₹)</label>
 <Input
 type="number"
 placeholder="499"
 className="bg-background border-border h-12 text-sm font-bold text-text-primary focus:ring-1 focus:ring-accent focus:border-accent/40"
 value={form.price}
 onChange={(e) => setForm({ ...form, price: e.target.value })}
 />
 </div>
 </div>

 <div className="space-y-2.5">
 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Asset Description</label>
 <Textarea
 placeholder="PROVIDE ARCHITECTURAL DETAILS ABOUT THIS MATERIAL..."
 className="bg-background border-border min-h-[140px] text-sm font-medium text-text-secondary focus:ring-1 focus:ring-accent focus:border-accent/40 resize-none"
 value={form.description}
 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="space-y-2.5">
 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Secure Core (PDF)</label>
 <div className="relative border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-accent/40 hover:bg-accent transition-all group">
 <Input
 type="file"
 accept=".pdf"
 className="absolute inset-0 opacity-0 cursor-pointer z-10"
 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0] || null;
 setFiles(prev => ({ ...prev, secureFile: file }));
 }}
 />
 <FileIcon className={`h-12 w-12 mb-4 transition-colors ${files.secureFile ? 'text-accent' : 'text-text-muted'}`} />
 <span className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted group-hover:text-text-primary transition-colors text-center px-4">
 {files.secureFile ? files.secureFile.name : 'UPLOAD SECURE ASSET'}
 </span>
 </div>
 </div>
 <div className="space-y-2.5">
 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Demo Preview (PDF)</label>
 <div className="relative border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-accent/20 hover:bg-accent/10 transition-all group">
 <Input
 type="file"
 accept=".pdf"
 className="absolute inset-0 opacity-0 cursor-pointer z-10"
 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0] || null;
 setFiles(prev => ({ ...prev, demoFile: file }));
 }}
 />
 <FileIcon className={`h-12 w-12 mb-4 transition-colors ${files.demoFile ? 'text-accent' : 'text-text-muted'}`} />
 <span className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted group-hover:text-text-primary transition-colors text-center px-4">
 {files.demoFile ? files.demoFile.name : 'UPLOAD DEMO STREAM'}
 </span>
 </div>
 </div>
 </div>

 <Button
 isLoading={isLoading}
 onClick={handleUpload}
 className="w-full bg-accent hover:bg-accent text-background font-black h-16 relative overflow-hidden group shadow-none shadow-none border-none transition-all hover:scale-[1.01] active:scale-[0.99]"
 >
 <span className="flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
 <Upload className="h-5 w-5"/>
 Initiate Deployment Protocol
 </span>
 </Button>
 </CardContent>
 </Card>
 </div>

 <div className="lg:col-span-2 space-y-6">
 <Card className="border-border bg-surface">
 <CardContent className="p-7 space-y-5">
 <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Protocol Rules</h3>
 <ul className="space-y-4">
 {[
"Assets must be in PDF format for secure streaming.",
"Watermarks will be applied dynamically to the secure core.",
"Acquisition price is stored in integer value (INR).",
"Demo streams are accessible to unverified entities."
 ].map((rule, idx) => (
 <li key={idx} className="flex gap-4 text-[11px] font-medium text-text-secondary leading-relaxed">
 <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5 shadow-none"/>
 {rule}
 </li>
 ))}
 </ul>
 </CardContent>
 </Card>

 <Card className="border-accent/30 bg-accent/10">
 <CardContent className="p-7 space-y-5">
 <h3 className="text-xs font-black text-accent uppercase tracking-[0.2em] flex items-center gap-2">
 <ShieldAlert className="h-4 w-4"/>
 Security Warning
 </h3>
 <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl">
 <p className="text-[10px] font-bold text-accent leading-relaxed text-center uppercase tracking-tighter">
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
