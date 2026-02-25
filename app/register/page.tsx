"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const { getDeviceId } = useAuth()
    const { showToast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")
        const formData = new FormData(event.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setIsLoading(false)
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }
        try {
            await api.post("/auth/register", { name, email, password, phone })
            showToast("Successfully signed up! Please verify your email.", "success")
            router.replace(`/verify-email?email=${email}`)
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a] px-4 py-12">
            <Card className="w-full max-w-sm shadow-none">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="h-14 w-14 rounded-xl overflow-hidden border border-[#1e2d45]">
                            <img src="/logo.png" alt="All Government Alerts" className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-xl">Create Account</CardTitle>
                        <CardDescription className="mt-1">Join India&apos;s #1 Government Exam Platform</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-3.5">
                            <Input
                                id="name"
                                name="name"
                                placeholder="Full Name"
                                type="text"
                                autoCapitalize="words"
                                autoComplete="name"
                                disabled={isLoading}
                                required
                            />
                            <Input
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                type="email"
                                autoComplete="email"
                                disabled={isLoading}
                                required
                            />
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="Phone Number (optional)"
                                type="tel"
                                autoComplete="tel"
                                disabled={isLoading}
                            />
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
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
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a70] hover:text-[#8a9bb0] transition-colors"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
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
                                Create Account
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 text-center text-sm text-[#4a5a70] border-t border-[#1e2d45] mt-2">
                    <Link href="/login" className="hover:text-[#8a9bb0] transition-colors font-medium">
                        Already have an account? <span className="text-[#c9a84c]">Sign In</span>
                    </Link>
                    <Link href="/" className="hover:text-[#8a9bb0] transition-colors text-xs">
                        ← Back to Home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
