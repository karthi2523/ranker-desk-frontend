"use client"

import { useState } from"react"
import Link from"next/link"
import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from"@/components/ui/card"
import { Shield, Eye, EyeOff } from"lucide-react"
import api from"@/lib/api"
import { useAuth } from"@/context/AuthContext"
import { useToast } from"@/context/ToastContext"
import { useRouter } from"next/navigation"

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

 // Basic validation
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
 // Register
 await api.post('/auth/register', { name, email, password, phone })
 showToast("Successfully signed up! Please verify your email.","success")
 router.replace(`/verify-email?email=${email}`)
 } catch (err: any) {
 setError(err.response?.data?.error ||"Registration failed. Please try again.")
 } finally {
 setIsLoading(false)
 }
 }

 return (
 <div className="flex items-center justify-center min-h-screen bg-background px-4 py-12 relative overflow-hidden">
 {/* Rich Background Layer */}
 <div className="absolute inset-0 -z-10">
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"/>
 <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full animate-pulse"/>
 <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full animate-pulse"style={{ animationDelay: '2s' }} />
 </div>

 <Card className="w-full max-w-sm relative z-10">
 <CardHeader className="space-y-4">
 <div className="flex justify-center">
 <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-none border border-border transition-transform hover:scale-105 duration-500">
 <img
 src="/logo.png"
 alt="All Government Alerts Logo"
 className="h-full w-full object-cover"
 />
 </div>
 </div>
 <div className="text-center">
 <CardTitle className="text-2xl font-black text-text-primary tracking-tight">Create Account</CardTitle>
 <CardDescription className="text-text-secondary font-medium tracking-tight">Join the #1 platform for Govt Exam Aspirants</CardDescription>
 </div>
 </CardHeader>
 <CardContent>
 <form onSubmit={onSubmit}>
 <div className="grid gap-4">
 <div className="grid gap-1">
 <Input
 id="name"
 name="name"
 placeholder="Full Name"
 type="text"
 autoCapitalize="words"
 autoComplete="name"
 autoCorrect="off"
 disabled={isLoading}
 required
 className="bg-transparent"
 />
 </div>
 <div className="grid gap-1">
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
 <div className="grid gap-1">
 <Input
 id="phone"
 name="phone"
 placeholder="Phone Number"
 type="tel"
 autoComplete="tel"
 disabled={isLoading}
 className="bg-transparent"
 />
 </div>
 <div className="grid gap-1">
 <div className="relative">
 <Input
 id="password"
 name="password"
 placeholder="Password"
 type={showPassword ?"text":"password"}
 autoComplete="new-password"
 disabled={isLoading}
 required
 className="bg-transparent pr-10"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-text-primary transition-colors"
 disabled={isLoading}
 >
 {showPassword ? (
 <EyeOff className="h-4 w-4"/>
 ) : (
 <Eye className="h-4 w-4"/>
 )}
 </button>
 </div>
 </div>
 <div className="grid gap-1">
 <div className="relative">
 <Input
 id="confirmPassword"
 name="confirmPassword"
 placeholder="Confirm Password"
 type={showConfirmPassword ?"text":"password"}
 autoComplete="new-password"
 disabled={isLoading}
 required
 className="bg-transparent pr-10"
 />
 <button
 type="button"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-text-primary transition-colors"
 disabled={isLoading}
 >
 {showConfirmPassword ? (
 <EyeOff className="h-4 w-4"/>
 ) : (
 <Eye className="h-4 w-4"/>
 )}
 </button>
 </div>
 </div>
 {error && (
 <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20 animate-in fade-in zoom-in-95">
 {error}
 </div>
 )}
 <Button disabled={isLoading} className="w-full h-11 transition-all active:scale-95">
 {isLoading && (
 <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
 )}
 Create Account
 </Button>
 </div>
 </form>
 </CardContent>
 <CardFooter className="flex flex-col gap-4 text-center text-sm text-text-secondary border-t border-border mt-4 pt-6">
 <Link href="/login"className="underline underline-offset-4 hover:text-text-primary transition-colors font-semibold">
 Already have an account? Sign In
 </Link>
 <Link href="/"className="hover:text-text-primary transition-colors text-xs font-medium">
 ← Back to Home
 </Link>
 </CardFooter>
 </Card>
 </div>
 )
}
