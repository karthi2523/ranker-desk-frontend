"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, ArrowRight, RefreshCw } from "lucide-react"
import api from "@/lib/api"
import { useToast } from "@/context/ToastContext"

function VerifyEmailForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const { showToast } = useToast()

    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!email) {
            router.replace("/register")
        }
    }, [email, router])

    async function onVerify(e: React.FormEvent) {
        e.preventDefault()
        if (otp.length !== 6) {
            setError("Please enter a 6-digit code")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            await api.post("/auth/verify-otp", { email, code: otp })
            showToast("Email verified successfully! You can now log in.", "success")
            router.replace("/login")
        } catch (error: any) {
            setError(error.response?.data?.message || "Invalid or expired OTP. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    async function onResend() {
        setIsResending(true)
        setError("")
        try {
            await api.post("/auth/resend-otp", { email })
            showToast("A new OTP has been sent to your email.", "info")
        } catch (error: any) {
            setError("Failed to resend OTP. Please try again later.")
        } finally {
            setIsResending(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-slate-800 bg-slate-900/40 relative z-10 shadow-none">
            <CardHeader className="space-y-4">
                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-none shadow-indigo-500/20 border border-white/10">
                        <img
                            src="/logo.png"
                            alt="All Government Alerts Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <CardTitle className="text-2xl font-black text-white tracking-tight">Verify Your Email</CardTitle>
                    <CardDescription className="text-slate-400 font-medium tracking-tight">
                        We&apos;ve sent a 6-digit code to <span className="text-indigo-400">{email}</span>
                        <span className="block mt-2 text-xs opacity-80">If you don't see it in your primary inbox, please check your spam folder.</span>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={onVerify} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="otp"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                            className="bg-slate-950 border-slate-800 text-slate-200 text-center text-2xl tracking-[0.5em] h-14 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                            disabled={isLoading}
                            required
                        />
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    </div>
                    <Button disabled={isLoading || otp.length !== 6} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11">
                        {isLoading ? (
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        Verify Account
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center text-sm text-slate-400">
                <button
                    onClick={onResend}
                    disabled={isResending}
                    className="flex items-center justify-center gap-2 hover:text-white transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={cn("h-4 w-4", isResending && "animate-spin")} />
                    Didn't receive a code? Resend
                </button>
                <Link href="/register" className="hover:text-white transition-colors">
                    Back to Sign Up
                </Link>
            </CardFooter>
        </Card>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join("")
}

export default function VerifyEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4 relative overflow-hidden">
            {/* Rich Background Layer */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <VerifyEmailForm />
            </Suspense>
        </div>
    )
}
