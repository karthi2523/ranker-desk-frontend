"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, CheckCircle2, Lock } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useNotifications } from "@/context/NotificationContext"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Item {
    id: string
    title: string
    description: string
    price: number
}

declare global {
    interface Window {
        Razorpay: any
    }
}

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true)
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export default function CheckoutPage({ params }: { params: { materialId: string } }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const type = searchParams.get("type") || "material"
    const { user } = useAuth()
    console.log("📌 CHECKOUT RENDER USER:", user);
    const { refresh: refreshNotifications } = useNotifications()
    const [item, setItem] = useState<Item | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (params.materialId) fetchItem()
    }, [params.materialId])

    const fetchItem = async () => {
        try {
            const endpoint = type === "package" ? `/packages/${params.materialId}` : `/materials/${params.materialId}`
            const response = await api.get(endpoint)
            setItem(response.data)
        } catch (err) {
            console.error("Failed to fetch item", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmPayment = async () => {
        if (!item || !user) return
        setIsProcessing(true)
        setError("")

        try {
            // Ensure Razorpay SDK is loaded
            const sdkLoaded = await loadRazorpayScript()
            if (!sdkLoaded) {
                setError("Failed to load payment SDK. Check your internet connection.")
                setIsProcessing(false)
                return
            }

            // STEP 1: Create a Razorpay order on the backend
            const payload = type === "package"
                ? { packageId: params.materialId }
                : { materialId: params.materialId }

            const { data: orderData } = await api.post("/payment/create-order", payload)

            // Lock body width to prevent Razorpay iframe from expanding the mobile viewport
            const lockBody = () => {
                document.body.style.overflow = 'hidden'
                document.body.style.width = '100vw'
                document.body.style.position = 'fixed'
                document.body.style.top = `-${window.scrollY}px`
            }
            const unlockBody = () => {
                const scrollY = document.body.style.top
                document.body.style.overflow = ''
                document.body.style.width = ''
                document.body.style.position = ''
                document.body.style.top = ''
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }

            // STEP 2: Open Razorpay modal with the order
            console.log("🚨 [RAZORPAY DEBUG] Prefill Data:", {
                name: user.name,
                email: user.email,
                phone: user.phone,
                computedContact: user.phone ? (user.phone.startsWith("+") ? user.phone : `+91${user.phone}`) : "EMPTY"
            });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "All Government Alerts",
                description: orderData.itemTitle,
                order_id: orderData.orderId,
                theme: { color: "#4f46e5" },
                prefill: {
                    name: user.name || "",
                    email: user.email || "",
                    contact: user.phone ? (user.phone.startsWith("+") ? user.phone : `+91${user.phone}`) : "",
                },
                readonly: {
                    contact: !!user.phone,
                    email: true,
                },
                handler: async function (response: {
                    razorpay_payment_id: string
                    razorpay_order_id: string
                    razorpay_signature: string
                }) {
                    unlockBody()
                    // STEP 3: Verify payment signature on the backend (security step)
                    try {
                        await api.post("/payment/verify", {
                            ...payload,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                        setIsSuccess(true)
                        setIsProcessing(false)
                        refreshNotifications()
                        setTimeout(() => router.push("/dashboard/vault"), 2000)
                    } catch (verifyErr: any) {
                        setError(verifyErr.response?.data?.message || "Payment verification failed. Contact support.")
                        setIsProcessing(false)
                    }
                },
                modal: {
                    ondismiss: () => {
                        unlockBody()
                        setIsProcessing(false)
                    },
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.on("payment.failed", (response: any) => {
                unlockBody()
                setError(`Payment failed: ${response.error.description}`)
                setIsProcessing(false)
            })
            lockBody()
            rzp.open()
        } catch (err: any) {
            setError(err.response?.data?.message || "Could not initiate payment. Please try again.")
            setIsProcessing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </div>
        )
    }

    if (!item) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-text-primary uppercase tracking-tighter">Asset not found</h2>
                <Button className="mt-4 bg-accent-hover hover:bg-accent" onClick={() => router.push("/dashboard/store")}>Return to Store</Button>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="rounded-full bg-accent/10 p-5 border border-accent/20">
                    <CheckCircle2 className="h-14 w-14 text-accent" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Payment Confirmed</h2>
                    <p className="text-text-secondary font-medium">Securing your intellectual assets in the sovereign vault...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link href="/dashboard/store" className="group flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Store
            </Link>

            <div className="space-y-2">
                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Secure Checkout</h2>
                <p className="text-text-secondary font-medium">Review your order and complete payment securely via Razorpay.</p>
            </div>

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
                        <div className="flex justify-between items-end pt-4 border-t border-border mt-2">
                            <span className="text-text-primary font-black uppercase tracking-widest text-sm">Total Amount</span>
                            <span className="text-3xl font-black text-accent tracking-tighter">₹{item.price}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8">
                    {error && (
                        <div className="w-full text-sm text-red-500 text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in fade-in">
                            {error}
                        </div>
                    )}
                    <Button
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                        className="w-full bg-accent hover:bg-accent-hover text-slate-950 h-16 text-sm font-black uppercase tracking-[0.2em] shadow-none border-none transition-all"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-3" />
                                Opening Payment Gateway...
                            </>
                        ) : (
                            <>
                                <Lock className="h-5 w-5 mr-3" />
                                Pay ₹{item.price} Securely
                            </>
                        )}
                    </Button>
                    <div className="flex items-center justify-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] bg-background py-2 px-4 rounded-full border border-border">
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                        Powered by Razorpay · 256-bit SSL Secured
                    </div>
                </CardFooter>
            </Card>

            <div className="rounded-2xl border border-border bg-surface p-8 space-y-6">
                <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-accent" />
                    Accepted Payment Methods
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {["UPI (PhonePe, GPay, Paytm)", "Debit / Credit Card", "Razorpay Wallet"].map((method) => (
                        <div key={method} className="border border-border rounded-xl p-4 text-center text-[10px] font-black uppercase tracking-widest text-text-muted bg-background">
                            {method}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
