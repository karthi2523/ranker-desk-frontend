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
import { motion } from "framer-motion"

export default function LoginPage() {
    const { user, login, getDeviceId } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState<"LOGIN" | "2FA">("LOGIN")
    const [email, setEmail] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [activeSessionExists, setActiveSessionExists] = useState(false)
    const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null)

    useEffect(() => {
        if (user) {
            router.replace("/dashboard")
        }
    }, [user, router])

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")
        setActiveSessionExists(false)

        const formData = new FormData(event.currentTarget)
        const emailVal = formData.get("email") as string
        const passwordVal = formData.get("password") as string

        await attemptLogin(emailVal, passwordVal, false)
    }

    async function attemptLogin(emailVal: string, passwordVal: string, forceLogin: boolean) {
        setIsLoading(true)
        try {
            const deviceFingerprint = getDeviceId()
            const response = await api.post('/auth/login', { email: emailVal, password: passwordVal, deviceFingerprint, forceLogin })

            if (response.data.require2FA) {
                setEmail(emailVal)
                setStep("2FA")
                return
            }

            const { accessToken, user: userData } = response.data
            login(accessToken, userData)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Invalid credentials. Please try again."
            setError(errorMessage)

            if (error.response?.status === 403 && error.response?.data?.activeSessionExists) {
                // Show the force-logout confirmation
                setPendingCredentials({ email: emailVal, password: passwordVal })
                setActiveSessionExists(true)
            } else if (error.response?.status === 403 && error.response?.data?.unverified) {
                setEmail(emailVal)
                setStep("2FA")
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function onVerify2FA(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await attemptVerify2FA(false)
    }

    async function attemptVerify2FA(forceLogin: boolean) {
        setIsLoading(true)
        setError("")
        setActiveSessionExists(false)

        try {
            const deviceFingerprint = getDeviceId()
            const response = await api.post('/auth/verify-login-2fa', {
                email,
                code: otpCode,
                deviceFingerprint,
                forceLogin
            })
            const { accessToken, user: userData } = response.data
            login(accessToken, userData)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Invalid or expired code"
            setError(errorMessage)

            if (error.response?.status === 403 && error.response?.data?.activeSessionExists) {
                setActiveSessionExists(true)
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function handleForceLogin() {
        setError("")
        setActiveSessionExists(false)
        if (step === "LOGIN" && pendingCredentials) {
            await attemptLogin(pendingCredentials.email, pendingCredentials.password, true)
        } else if (step === "2FA") {
            await attemptVerify2FA(true)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-raised via-background to-background px-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-sm relative z-10"
            >
                <Card className="border-border bg-surface/80 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-4">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(201,168,76,0.2)] border border-accent/20 transition-transform hover:scale-105 duration-500 bg-background flex items-center justify-center p-2">
                                <img
                                    src="/logo.png"
                                    alt="All Government Alerts Logo"
                                    className="h-full w-full object-contain drop-shadow-md"
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-text-primary to-text-secondary tracking-tight">
                                {step === "LOGIN" ? "Welcome Back" : "Security Verification"}
                            </CardTitle>
                            <CardDescription className="text-text-secondary font-medium tracking-tight mt-1">
                                {step === "LOGIN" ? "Access your study materials" : (
                                    <span className="flex flex-col gap-1">
                                        <span>Enter the code sent to your email</span>
                                        <span className="text-xs opacity-80">If not found in your primary inbox, please check your spam folder.</span>
                                    </span>
                                )}
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
                                            className="bg-transparent"
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
                                                className="bg-transparent pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
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
                                        <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20 animate-in fade-in zoom-in-95">
                                            {error}
                                        </div>
                                    )}
                                    {activeSessionExists && (
                                        <div className="space-y-2 animate-in fade-in zoom-in-95">
                                            <div className="text-xs text-amber-500 text-center bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                                ⚠️ Your account is active on another device. Sign in here to terminate that session.
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={handleForceLogin}
                                                disabled={isLoading}
                                                className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                                            >
                                                {isLoading ? (
                                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                ) : "Sign In & Terminate Other Session"}
                                            </Button>
                                        </div>
                                    )}
                                    <Button disabled={isLoading} className="w-full h-11 transition-all hover:scale-[1.02] active:scale-[0.98] font-black tracking-wide shadow-[0_4px_14px_0_rgba(201,168,76,0.4)]">
                                        {isLoading && (
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
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
                                            value={otpCode || ""}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            disabled={isLoading}
                                            required
                                            className="text-center text-2xl tracking-[0.5em] font-bold text-accent h-14"
                                            maxLength={6}
                                        />
                                    </div>
                                    {error && (
                                        <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                                            {error}
                                        </div>
                                    )}
                                    {activeSessionExists && (
                                        <div className="space-y-2 animate-in fade-in zoom-in-95">
                                            <div className="text-xs text-amber-500 text-center bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                                ⚠️ Your account is active on another device. Sign in here to terminate that session.
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={handleForceLogin}
                                                disabled={isLoading}
                                                className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                                            >
                                                {isLoading ? (
                                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                ) : "Sign In & Terminate Other Session"}
                                            </Button>
                                        </div>
                                    )}
                                    <Button disabled={isLoading} className="w-full h-11 transition-all active:scale-95">
                                        {isLoading && (
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        )}
                                        Verify & Access
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setStep("LOGIN")}
                                        className="text-xs text-text-secondary hover:text-text-primary transition-colors text-center mt-2"
                                        disabled={isLoading}
                                    >
                                        Back to login
                                    </button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center text-sm text-text-secondary border-t border-border mt-4 pt-6">
                        <Link href="/register" className="underline underline-offset-4 hover:text-text-primary transition-colors font-semibold">
                            Don&apos;t have an account? Sign Up
                        </Link>
                        <Link href="/" className="hover:text-text-primary transition-colors text-xs font-bold flex items-center gap-1 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
