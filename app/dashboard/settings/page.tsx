"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { ArrowRight, CheckCircle2, Lock, Shield, User } from "lucide-react"
import { useToast } from "@/context/ToastContext"
import { useNotifications } from "@/context/NotificationContext"
import api from "@/lib/api"

export default function SettingsPage() {
    const { user } = useAuth()
    const { showToast } = useToast()
    const { refresh: refreshNotifications } = useNotifications()
    const [isLoading, setIsLoading] = useState(false)

    // Password State
    const [step, setStep] = useState<"form" | "otp">("form")
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    })
    const [otp, setOtp] = useState("")

    const handleRequestChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.new !== passwords.confirm) {
            return showToast("New passwords do not match", "error")
        }
        if (passwords.new.length < 6) {
            return showToast("Password must be at least 6 characters", "error")
        }

        setIsLoading(true)
        try {
            await api.post("/auth/request-password-change", {
                currentPassword: passwords.current
            })
            showToast("Verification code sent to your email", "success")
            refreshNotifications() // Instant sync
            setStep("otp")
        } catch (error: any) {
            showToast(error.response?.data?.message || "Verification failed", "error")
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
            showToast("Password updated successfully!", "success")
            setStep("form")
            setPasswords({ current: "", new: "", confirm: "" })
            setOtp("")
        } catch (error: any) {
            showToast(error.response?.data?.message || "Update failed", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Settings</h2>
                <p className="text-sm text-slate-400">Manage your account and security preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-white">Profile Information</CardTitle>
                        </div>
                        <CardDescription>Update your display name and view your registered email.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-300">Display Name</Label>
                            <Input id="name" defaultValue={user?.name || ""} className="bg-slate-950 border-slate-800 text-white" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-300 text-opacity-50">Email Address (Fixed)</Label>
                            <Input id="email" type="email" defaultValue={user?.email} disabled className="bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed" />
                        </div>
                        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">Update Profile</Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 relative overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-white">Security</CardTitle>
                        </div>
                        <CardDescription>
                            {step === "form"
                                ? "Change your password with multi-step verification."
                                : "Check your email for the verification code."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === "form" ? (
                            <form onSubmit={handleRequestChange} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current" className="text-slate-300">Current Password</Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        required
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new" className="text-slate-300">New Password</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        required
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="bg-slate-950 border-slate-800 text-white"
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm" className="text-slate-300">Confirm New Password</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        required
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {isLoading ? "Verifying..." : "Verify & Send OTP"}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleCompleteChange} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="otp" className="text-slate-300">Verification Code (6-digits)</Label>
                                    <Input
                                        id="otp"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                        className="bg-slate-950 border-slate-800 text-white text-center text-2xl tracking-[0.5em] h-12"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isLoading || otp.length !== 6}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {isLoading ? "Updating..." : "Confirm Password Change"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep("form")}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 border-red-900/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-red-500" />
                            <CardTitle className="text-white">Danger Zone</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <Button variant="destructive">Delete Account</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
