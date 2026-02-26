"use client"

import { useState, useEffect } from"react"
import { useRouter } from"next/navigation"
import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Textarea } from"@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card"
import { Loader2, Plus, CheckCircle2, LayoutDashboard, FileText } from"lucide-react"
import api from"@/lib/api"
import { cn } from"@/lib/utils"

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
 title:"",
 price:"",
 description:"",
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
 setError(err.response?.data?.message ||"Failed to create package.")
 } finally {
 setIsLoading(false)
 }
 }

 if (isSuccess) {
 return (
 <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
 <CheckCircle2 className="h-16 w-16 text-accent mb-4 animate-bounce"/>
 <h2 className="text-2xl font-bold text-text-primary">Package Created!</h2>
 <p className="text-text-secondary mt-2">The package has been successfully deployed to the store.</p>
 </div>
 )
 }

 return (
 <div className="max-w-3xl mx-auto space-y-6">
 <div className="space-y-1">
 <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary uppercase tracking-tighter">Package Creator</h2>
 <p className="text-sm text-text-secondary">Bundle existing assets into a new secure package.</p>
 </div>

 <Card className="border-accent/30 bg-surface">
 <CardHeader>
 <CardTitle>Package Configuration</CardTitle>
 <CardDescription>
 Set pricing and associate multiple protected resources.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 {error && (
 <div className="p-3 text-sm font-medium text-accent bg-accent/10 border border-accent/30 rounded-lg">
 {error}
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-sm font-medium text-text-primary">Package Title</label>
 <Input
 placeholder="e.g. Master CSAT Bundle"
 className="bg-background border-border"
 value={form.title}
 onChange={(e) => setForm({ ...form, title: e.target.value })}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-text-primary">Package Price (INR)</label>
 <Input
 type="number"
 placeholder="999"
 className="bg-background border-border"
 value={form.price}
 onChange={(e) => setForm({ ...form, price: e.target.value })}
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-text-primary">Description</label>
 <Textarea
 placeholder="Provide details about the package content..."
 className="bg-background border-border min-h-[100px]"
 value={form.description}
 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
 />
 </div>

 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <label className="text-sm font-medium text-text-primary flex items-center gap-2">
 <LayoutDashboard className="h-4 w-4 text-accent"/>
 Select Assets
 </label>
 <span className="text-xs text-text-muted font-bold uppercase tracking-widest">
 Selected: {selectedMaterialIds.size}
 </span>
 </div>

 <div className="border border-border rounded-xl overflow-hidden bg-background max-h-64 overflow-y-auto w-full p-2">
 {isFetching ? (
 <div className="p-8 text-center flex flex-col items-center">
 <Loader2 className="h-6 w-6 animate-spin text-text-muted mb-2"/>
 <span className="text-sm text-text-secondary">Loading assets...</span>
 </div>
 ) : availableMaterials.length === 0 ? (
 <div className="p-8 text-center">
 <span className="text-sm text-text-secondary">No materials available. Please upload some first.</span>
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
 ?"bg-accent border-accent/40 shadow-none"
 :"bg-surface border-border hover:border-border"
 )}
 >
 <div className={cn(
"w-4 h-4 mt-0.5 shrink-0 rounded border flex items-center justify-center transition-colors",
 isSelected ?"bg-accent border-accent/40":"border-slate-600"
 )}>
 {isSelected && <CheckCircle2 className="h-3 w-3 text-text-primary"/>}
 </div>
 <div className="flex-1 min-w-0">
 <p className={cn(
"text-sm font-semibold truncate",
 isSelected ?"text-accent":"text-text-primary"
 )}>
 {mat.title}
 </p>
 <p className="text-xs text-accent font-bold mt-1">
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
 className="w-full bg-accent/10 hover:bg-accent/10 text-text-primary font-bold h-12 relative overflow-hidden group shadow-none shadow-none disabled:opacity-50 mt-4"
 onClick={handleCreate}
 disabled={isLoading || selectedMaterialIds.size === 0}
 >
 {isLoading ? (
 <Loader2 className="h-5 w-5 animate-spin"/>
 ) : (
 <span className="flex items-center gap-2">
 <Plus className="h-4 w-4"/>
 Publish Package
 </span>
 )}
 </Button>
 </CardContent>
 </Card>
 </div>
 )
}
