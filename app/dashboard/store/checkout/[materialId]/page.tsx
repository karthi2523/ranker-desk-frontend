"use client"

import { useEffect, useState } from"react"
import { useRouter } from"next/navigation"
import { Button } from"@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from"@/components/ui/card"
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, CheckCircle2 } from"lucide-react"
import api from"@/lib/api"
import { useAuth } from"@/context/AuthContext"
import { useNotifications } from"@/context/NotificationContext"
import Link from"next/link"
import { useSearchParams } from"next/navigation"

interface Item {
 id: string
 title: string
 description: string
 price: number
}

export default function CheckoutPage({ params }: { params: { materialId: string } }) {
 const router = useRouter()
 const searchParams = useSearchParams()
 const type = searchParams.get('type') || 'material'
 const { user } = useAuth()
 const { refresh: refreshNotifications } = useNotifications()
 const [item, setItem] = useState<Item | null>(null)
 const [isLoading, setIsLoading] = useState(true)
 const [isProcessing, setIsProcessing] = useState(false)
 const [isSuccess, setIsSuccess] = useState(false)

 useEffect(() => {
 if (params.materialId) {
 fetchItem()
 }
 }, [params.materialId])

 const fetchItem = async () => {
 try {
 const endpoint = type === 'package' ? `/packages/${params.materialId}` : `/materials/${params.materialId}`
 const response = await api.get(endpoint)
 setItem(response.data)
 } catch (error) {
 console.error("Failed to fetch item", error)
 } finally {
 setIsLoading(false)
 }
 }

 const handleConfirmPayment = async () => {
 setIsProcessing(true)
 try {
 const payload = type === 'package'
 ? { packageId: params.materialId }
 : { materialId: params.materialId }

 await api.post('/orders', payload)
 setIsSuccess(true)
 refreshNotifications() // Instant sync
 setTimeout(() => {
 router.push('/dashboard/vault')
 }, 2000)
 } catch (error: any) {
 alert(error.response?.data?.message ||"Payment failed. Please try again.")
 setIsProcessing(false)
 }
 }

 if (isLoading) {
 return (
 <div className="flex h-[400px] items-center justify-center">
 <Loader2 className="h-10 w-10 animate-spin text-accent"/>
 </div>
 )
 }

 if (!item) {
 return (
 <div className="text-center py-12">
 <h2 className="text-xl font-bold text-text-primary uppercase tracking-tighter">Asset not found</h2>
 <Button className="mt-4 bg-accent-hover hover:bg-accent"onClick={() => router.push('/dashboard/store')}>Return to Store</Button>
 </div>
 )
 }

 if (isSuccess) {
 return (
 <div className="flex h-[400px] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
 <div className="rounded-full bg-accent/10 p-5 border border-accent/20">
 <CheckCircle2 className="h-14 w-14 text-accent"/>
 </div>
 <div className="space-y-2">
 <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Acquisition Successful</h2>
 <p className="text-text-secondary font-medium">Securing your intellectual assets in the sovereign vault...</p>
 </div>
 </div>
 )
 }

 return (
 <div className="max-w-2xl mx-auto space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <Link href="/dashboard/store"className="group flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
 <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1"/>
 Back to Store
 </Link>

 <div className="space-y-2">
 <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Secure Acquisition</h2>
 <p className="text-text-secondary font-medium">Review your order and initiate the transfer protocol.</p>
 </div>

 <div className="grid gap-8 md:grid-cols-1">
 <Card className="border-border bg-surface overflow-hidden shadow-none">
 <CardHeader className="border-b border-border bg-background">
 <CardTitle className="text-text-primary text-sm font-black uppercase tracking-widest">Order Summary</CardTitle>
 </CardHeader>
 <CardContent className="space-y-6 pt-6">
 <div className="flex justify-between items-start pb-6 border-b border-border">
 <div className="space-y-1">
 <h3 className="font-bold text-text-primary text-lg">{item.title}</h3>
 <p className="text-sm text-text-secondary line-clamp-1 max-w-[300px]">{item.description}</p>
 </div>
 <span className="font-black text-text-primary text-2xl tracking-tighter">₹{item.price}</span>
 </div>
 <div className="space-y-3 pt-2">
 <div className="flex justify-between text-sm font-bold">
 <span className="text-text-muted uppercase tracking-widest text-[10px]">Subtotal</span>
 <span className="text-text-secondary">₹{item.price}</span>
 </div>
 <div className="flex justify-between text-sm font-bold">
 <span className="text-text-muted uppercase tracking-widest text-[10px]">Security Fee</span>
 <span className="text-accent uppercase tracking-widest text-[10px]">Waived</span>
 </div>
 <div className="flex justify-between items-end pt-4 border-t border-border mt-2">
 <span className="text-text-primary font-black uppercase tracking-widest text-sm">Total Amount</span>
 <span className="text-3xl font-black text-accent tracking-tighter">₹{item.price}</span>
 </div>
 </div>
 </CardContent>
 <CardFooter className="flex flex-col space-y-5 pb-8">
 <Button
 onClick={handleConfirmPayment}
 disabled={isProcessing}
 className="w-full bg-accent hover:bg-accent-hover text-slate-950 h-16 text-sm font-black uppercase tracking-[0.2em] shadow-none border-none transition-all"
 >
 {isProcessing ? (
 <Loader2 className="h-6 w-6 animate-spin"/>
 ) : (
 <>
 <CreditCard className="h-5 w-5 mr-3"/>
 Confirm & Pay
 </>
 )}
 </Button>
 <div className="flex items-center justify-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] bg-background py-2 px-4 rounded-full border border-border">
 <ShieldCheck className="h-3.5 w-3.5 text-accent"/>
 Secure RSA-2048 Encryption
 </div>
 </CardFooter>
 </Card>

 <div className="rounded-2xl border border-border bg-surface p-8 space-y-6">
 <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-3">
 <CreditCard className="h-4 w-4 text-accent"/>
 Available Protocols
 </h3>
 <div className="grid grid-cols-2 gap-4">
 {[
"UPI (PhonePe, GPay)",
"Debit / Credit Card",
"Net Banking",
"Sovereign Wallets"
 ].map((method) => (
 <div key={method} className="border border-border rounded-xl p-4 text-center text-[10px] font-black uppercase tracking-widest text-text-muted bg-background">
 {method}
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )
}
