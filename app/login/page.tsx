"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const { user, login, getDeviceId } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState<"LOGIN" | "2FA">("LOGIN")
    const [email, setEmail] = useState("")
    const [otpCode, setOtpCode] = useState("")

    useEffect(() => {
        if (user) {
            router.replace("/dashboard")
        }
    }, [user, router])

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const deviceFingerprint = getDeviceId()
            const response = await api.post('/auth/login', { email, password, deviceFingerprint })

            if (response.data.require2FA) {
                setEmail(email)
                setStep("2FA")
                return
            }

            const { accessToken, user } = response.data
            login(accessToken, user)
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Invalid credentials. Please try again."
            setError(errorMessage)

            // If user is not verified, we can offer to redirect or show a clearer message
            if (err.response?.status === 403 && err.response?.data?.unverified) {
                setEmail(email)
                setStep("2FA")
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function onVerify2FA(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const deviceFingerprint = getDeviceId()
            const response = await api.post('/auth/verify-login-2fa', {
                email,
                code: otpCode,
                deviceFingerprint
            })
            const { accessToken, user } = response.data
            login(accessToken, user)
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid or expired code")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4 relative overflow-hidden">
            {/* Rich Background Layer */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <Card className="w-full max-w-sm border-slate-800 bg-slate-900/40 backdrop-blur-xl relative z-10 shadow-2xl shadow-black/50">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10">
                            <img
                                src="/logo.png"
                                alt="All Government Alerts Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <CardTitle className="text-2xl font-black text-white tracking-tight">
                            {step === "LOGIN" ? "Welcome Back" : "Security Verification"}
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-medium tracking-tight">
                            {step === "LOGIN" ? "Access your secure study vault" : "Enter the code sent to your email"}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {step === "LOGIN" ? (
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        required
                                        className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            type={showPassword ? "text" : "password"}
                                            autoCapitalize="none"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            required
                                            className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {error && (
                                    <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                                        {error}
                                    </div>
                                )}
                                <Button disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isLoading && (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    )}
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={onVerify2FA}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Input
                                        id="otp"
                                        placeholder="6-digit code"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        className="bg-slate-950 border-slate-800 text-center text-2xl tracking-[0.5em] font-bold text-indigo-400 h-14"
                                        maxLength={6}
                                    />
                                </div>
                                {error && (
                                    <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                                        {error}
                                    </div>
                                )}
                                <Button disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isLoading && (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    )}
                                    Verify & Access
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep("LOGIN")}
                                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    Back to login
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-slate-400">
                    <Link href="/register" className="underline underline-offset-4 hover:text-white transition-colors">
                        Don&apos;t have an account? Sign Up
                    </Link>
                    <Link href="/" className="hover:text-white transition-colors">
                        Back to Home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
