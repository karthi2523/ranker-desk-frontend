"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
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
        if (user) router.replace("/dashboard")
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
            const response = await api.post("/auth/login", { email, password, deviceFingerprint })
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
            const response = await api.post("/auth/verify-login-2fa", { email, code: otpCode, deviceFingerprint })
            const { accessToken, user } = response.data
            login(accessToken, user)
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid or expired code")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a] px-4">
            <Card className="w-full max-w-md shadow-none">
                <CardHeader className="space-y-4 text-center pb-6">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-xl overflow-hidden border border-[#1e2d45]">
                            <img src="/logo.png" alt="All Government Alerts" className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-xl">
                            {step === "LOGIN" ? "Welcome Back" : "Verify Your Identity"}
                        </CardTitle>
                        <CardDescription>
                            {step === "LOGIN" ? "Sign in to access your study vault" : "Enter the 6-digit code sent to your email"}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    {step === "LOGIN" ? (
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-1.5">
                                    <label htmlFor="email" className="text-xs font-semibold text-[#8a9bb0] uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <label htmlFor="password" className="text-xs font-semibold text-[#8a9bb0] uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            required
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a70] hover:text-[#8a9bb0] transition-colors"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {error && (
                                    <div className="text-sm text-[#e05252] text-center bg-[#e05252]/10 p-2.5 rounded-lg border border-[#e05252]/20">
                                        {error}
                                    </div>
                                )}
                                <Button disabled={isLoading} className="w-full h-11 mt-1">
                                    {isLoading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0e1a] border-t-transparent" />
                                    )}
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={onVerify2FA}>
                            <div className="grid gap-4">
                                <Input
                                    id="otp"
                                    placeholder="000000"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    className="text-center text-2xl tracking-[0.5em] font-bold text-[#c9a84c] h-14"
                                    maxLength={6}
                                />
                                {error && (
                                    <div className="text-sm text-[#e05252] text-center bg-[#e05252]/10 p-2.5 rounded-lg border border-[#e05252]/20">
                                        {error}
                                    </div>
                                )}
                                <Button disabled={isLoading} className="w-full">
                                    {isLoading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0e1a] border-t-transparent" />
                                    )}
                                    Verify & Access
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep("LOGIN")}
                                    className="text-xs text-[#4a5a70] hover:text-[#8a9bb0] transition-colors text-center"
                                    disabled={isLoading}
                                >
                                    Back to login
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3 text-center text-sm text-[#4a5a70] border-t border-[#1e2d45] mt-2">
                    <Link href="/register" className="hover:text-[#c9a84c] transition-colors font-medium">
                        Don&apos;t have an account? <span className="text-[#c9a84c]">Sign Up</span>
                    </Link>
                    <Link href="/" className="hover:text-[#8a9bb0] transition-colors text-xs">
                        ← Back to Home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
