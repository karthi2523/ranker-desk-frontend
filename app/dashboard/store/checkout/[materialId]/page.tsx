"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useNotifications } from "@/context/NotificationContext"
import Link from "next/link"

interface Material {
    id: string
    title: string
    description: string
    price: number
}

export default function CheckoutPage({ params }: { params: { materialId: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const { refresh: refreshNotifications } = useNotifications()
    const [material, setMaterial] = useState<Material | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        if (params.materialId) {
            fetchMaterial()
        }
    }, [params.materialId])

    const fetchMaterial = async () => {
        try {
            const response = await api.get(`/materials/${params.materialId}`)
            setMaterial(response.data)
        } catch (error) {
            console.error("Failed to fetch material", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmPayment = async () => {
        setIsProcessing(true)
        try {
            await api.post('/orders', { materialId: params.materialId })
            setIsSuccess(true)
            refreshNotifications() // Instant sync
            setTimeout(() => {
                router.push('/dashboard/materials')
            }, 2000)
        } catch (error: any) {
            alert(error.response?.data?.message || "Payment failed. Please try again.")
            setIsProcessing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    if (!material) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-white">Material not found</h2>
                <Button className="mt-4" onClick={() => router.push('/dashboard/store')}>Back to Store</Button>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-emerald-500/10 p-4">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                <p className="text-slate-400">Redirecting you to your materials...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-4">
            <Link href="/dashboard/store" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Store
            </Link>

            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Checkout</h2>
                <p className="text-slate-400">Review your order and complete the payment.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-1">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                            <div>
                                <h3 className="font-semibold text-white">{material.title}</h3>
                                <p className="text-sm text-slate-400 line-clamp-1">{material.description}</p>
                            </div>
                            <span className="font-bold text-white text-lg">₹{material.price}</span>
                        </div>
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-white">₹{material.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Platform Fee</span>
                                <span className="text-emerald-500">FREE</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-4 border-t border-slate-800">
                                <span className="text-white">Total Amount</span>
                                <span className="text-indigo-400">₹{material.price}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={isProcessing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg font-semibold gap-2"
                        >
                            {isProcessing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <CreditCard className="h-5 w-5" />
                            )}
                            Confirm & Pay ₹{material.price}
                        </Button>
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                            <ShieldCheck className="h-3 w-3" />
                            Secure Encrypted Payment
                        </div>
                    </CardFooter>
                </Card>

                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-indigo-400" />
                        Available Payment Methods
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-slate-800 rounded-lg p-3 text-center text-xs text-slate-400 bg-slate-950/50">
                            UPI (PhonePe, GPay)
                        </div>
                        <div className="border border-slate-800 rounded-lg p-3 text-center text-xs text-slate-400 bg-slate-950/50">
                            Debit / Credit Card
                        </div>
                        <div className="border border-slate-800 rounded-lg p-3 text-center text-xs text-slate-400 bg-slate-950/50">
                            Net Banking
                        </div>
                        <div className="border border-slate-800 rounded-lg p-3 text-center text-xs text-slate-400 bg-slate-950/50">
                            Wallets
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
