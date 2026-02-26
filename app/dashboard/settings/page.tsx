"use client"

import { useState } from"react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card"
import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Label } from"@/components/ui/label"
import { useAuth } from"@/context/AuthContext"
import { ArrowRight, CheckCircle2, Lock, Shield, User } from"lucide-react"
import { useToast } from"@/context/ToastContext"
import { useNotifications } from"@/context/NotificationContext"
import api from"@/lib/api"

export default function SettingsPage() {
 const { user, setUser } = useAuth()
 const { showToast } = useToast()
 const { refresh: refreshNotifications } = useNotifications()
 const [isLoading, setIsLoading] = useState(false)
 const [name, setName] = useState(user?.name ||"")

 const handleUpdateProfile = async (e: React.FormEvent) => {
 e.preventDefault()
 if (!name.trim()) return showToast("Name cannot be empty","error")

 setIsLoading(true)
 try {
 const response = await api.put("/auth/update-profile", { name })
 showToast("Profile updated successfully","success")
 if (setUser) {
 setUser(prev => prev ? { ...prev, name: response.data.user.name } : null)
 }
 } catch (error: unknown) {
 showToast(error.response?.data?.message ||"Update failed","error")
 } finally {
 setIsLoading(false)
 }
 }

 // Password State
 const [step, setStep] = useState<"form"|"otp">("form")
 const [passwords, setPasswords] = useState({
 current:"",
 new:"",
 confirm:""
 })
 const [otp, setOtp] = useState("")

 const handleRequestChange = async (e: React.FormEvent) => {
 e.preventDefault()
 if (passwords.new !== passwords.confirm) {
 return showToast("New passwords do not match","error")
 }
 if (passwords.new.length < 6) {
 return showToast("Password must be at least 6 characters","error")
 }

 setIsLoading(true)
 try {
 await api.post("/auth/request-password-change", {
 currentPassword: passwords.current
 })
 showToast("Verification code sent to your email","success")
 refreshNotifications() // Instant sync
 setStep("otp")
 } catch (error: unknown) {
 showToast(error.response?.data?.message ||"Verification failed","error")
 } finally {
 setIsLoading(false)
 }
 }

 const handleCompleteChange = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsLoading(true)
 try {
 await api.post("/auth/complete-password-change", {
 code: otp,
 newPassword: passwords.new
 })
 showToast("Password updated successfully!","success")
 setStep("form")
 setPasswords({ current:"", new:"", confirm:""})
 setOtp("")
 } catch (error: unknown) {
 showToast(error.response?.data?.message ||"Update failed","error")
 } finally {
 setIsLoading(false)
 }
 }

 return (
 <div className="space-y-6">
 <div className="space-y-1">
 <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary uppercase tracking-tighter">Settings</h2>
 <p className="text-sm text-text-secondary">Manage your account and security preferences.</p>
 </div>

 <div className="grid gap-6">
 <Card className="bg-surface border-border">
 <CardHeader>
 <div className="flex items-center gap-2">
 <User className="h-5 w-5 text-accent"/>
 <CardTitle className="text-text-primary">Profile Information</CardTitle>
 </div>
 <CardDescription>Update your display name and view your registered email.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <form onSubmit={handleUpdateProfile} className="space-y-4">
 <div className="grid gap-2">
 <Label htmlFor="name"className="text-text-secondary">Display Name</Label>
 <Input
 id="name"
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="bg-background border-border text-text-primary"
 />
 </div>
 <div className="grid gap-2">
 <Label htmlFor="email"className="text-text-secondary text-opacity-50">Email Address (Fixed)</Label>
 <Input id="email"type="email"defaultValue={user?.email} disabled className="bg-background border-border text-text-muted cursor-not-allowed"/>
 </div>
 <Button
 type="submit"
 disabled={isLoading || name === user?.name}
 className="w-full sm:w-auto bg-accent hover:bg-accent"
 >
 {isLoading ?"Updating...":"Update Profile"}
 </Button>
 </form>
 </CardContent>
 </Card>

 <Card className="bg-surface border-border relative overflow-hidden">
 <CardHeader>
 <div className="flex items-center gap-2">
 <Lock className="h-5 w-5 text-accent"/>
 <CardTitle className="text-text-primary">Security</CardTitle>
 </div>
 <CardDescription>
 {step ==="form"
 ?"Change your password with multi-step verification."
 :"Check your email for the verification code."}
 </CardDescription>
 </CardHeader>
 <CardContent>
 {step ==="form"? (
 <form onSubmit={handleRequestChange} className="space-y-4">
 <div className="grid gap-2">
 <Label htmlFor="current"className="text-text-secondary">Current Password</Label>
 <Input
 id="current"
 type="password"
 required
 value={passwords.current}
 onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
 className="bg-background border-border text-text-primary"
 />
 </div>
 <div className="grid gap-2">
 <Label htmlFor="new"className="text-text-secondary">New Password</Label>
 <Input
 id="new"
 type="password"
 required
 value={passwords.new}
 onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
 className="bg-background border-border text-text-primary"
 placeholder="Min 6 characters"
 />
 </div>
 <div className="grid gap-2">
 <Label htmlFor="confirm"className="text-text-secondary">Confirm New Password</Label>
 <Input
 id="confirm"
 type="password"
 required
 value={passwords.confirm}
 onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
 className="bg-background border-border text-text-primary"
 />
 </div>
 <Button
 type="submit"
 disabled={isLoading}
 className="w-full sm:w-auto bg-accent hover:bg-accent"
 >
 {isLoading ?"Verifying...":"Verify & Send OTP"}
 </Button>
 </form>
 ) : (
 <form onSubmit={handleCompleteChange} className="space-y-4">
 <div className="grid gap-2">
 <Label htmlFor="otp"className="text-text-secondary">Verification Code (6-digits)</Label>
 <Input
 id="otp"
 placeholder="000000"
 maxLength={6}
 required
 value={otp}
 onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g,""))}
 className="bg-background border-border text-text-primary text-center text-2xl tracking-[0.5em] h-12"
 />
 </div>
 <div className="flex flex-col sm:flex-row gap-3">
 <Button
 type="submit"
 disabled={isLoading || otp.length !== 6}
 className="flex-1 bg-green-600 hover:bg-green-700 text-text-primary"
 >
 {isLoading ?"Updating...":"Confirm Password Change"}
 </Button>
 <Button
 type="button"
 variant="ghost"
 onClick={() => setStep("form")}
 className="text-text-secondary hover:text-text-primary"
 >
 Cancel
 </Button>
 </div>
 </form>
 )}
 </CardContent>
 </Card>

 <Card className="bg-surface border-border border-accent/30">
 <CardHeader>
 <div className="flex items-center gap-2">
 <Shield className="h-5 w-5 text-accent"/>
 <CardTitle className="text-text-primary">Danger Zone</CardTitle>
 </div>
 </CardHeader>
 <CardContent>
 <p className="text-sm text-text-secondary mb-4">Once you delete your account, there is no going back. Please be certain.</p>
 <Button variant="destructive">Delete Account</Button>
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
