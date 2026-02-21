"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Watermark } from "./Watermark"
import { AlertTriangle, EyeOff, Loader2, ShieldCheck, ShieldAlert } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface Material {
    id: string
    title: string
    description: string | null
    price: number
}

export function VaultViewer({ materialId }: { materialId: string }) {
    const router = useRouter()
    const { user } = useAuth()
    const [material, setMaterial] = useState<(Material & { hasAccess: boolean, fileExists: boolean }) | null>(null)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isBlurred, setIsBlurred] = useState(false)
    const [showSessionAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isStreaming, setIsStreaming] = useState(false)

    // Security Event Listeners
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault()
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && (e.key === 's' || e.key === 'p')) || e.key === 'PrintScreen') {
                e.preventDefault()
                alert("Vault Protection: Action Blocked")
            }
        }
        const handleVisibilityChange = () => setIsBlurred(document.hidden)
        const handleWindowBlur = () => setIsBlurred(true)
        const handleWindowFocus = () => setIsBlurred(false)

        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('blur', handleWindowBlur)
        window.addEventListener('focus', handleWindowFocus)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('blur', handleWindowBlur)
            window.removeEventListener('focus', handleWindowFocus)
            if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        }
    }, [pdfUrl])

    useEffect(() => {
        if (materialId) {
            fetchMaterialAndStream()
        }
    }, [materialId])

    const fetchMaterialAndStream = async () => {
        try {
            setIsLoading(true)
            const response = await api.get(`/materials/${materialId}`)
            const data = response.data
            setMaterial(data)

            if (data.hasAccess && data.fileExists) {
                setIsStreaming(true)
                const pdfResponse = await api.get(`/materials/${materialId}/stream`, {
                    responseType: 'blob'
                })
                const url = URL.createObjectURL(pdfResponse.data)
                setPdfUrl(url)
            }
        } catch (error) {
            console.error("Vault access error:", error)
        } finally {
            setIsLoading(false)
            setIsStreaming(false)
        }
    }

    if (!user) return null

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950 flex flex-col">
            {/* Security Alert Modal */}
            <Modal
                isOpen={showSessionAlert}
                onClose={() => router.push('/dashboard/materials')}
                title="Sovereign Shield: Session Alert"
                description="Session rotation detected or multi-device access. To protect your vault, this session is being locked."
            >
                <Button className="w-full bg-indigo-600" onClick={() => router.push('/dashboard/materials')}>
                    Return to Mission Dashboard
                </Button>
            </Modal>

            {/* Top Warning Bar */}
            <div className="h-10 md:h-8 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between px-4 md:px-6 text-[9px] md:text-[10px] font-bold tracking-widest md:tracking-[0.2em] text-indigo-400/80 uppercase select-none">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">Secure Environment Active</span>
                    <span className="sm:hidden text-[8px]">SECURE</span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden truncate">
                    <span className="hidden sm:inline text-slate-500 uppercase">Audit:</span>
                    {user.email}
                </div>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-amber-500/50 shrink-0" />
                    <span className="hidden sm:inline">Watermarked</span>
                </div>
            </div>

            {/* Main Viewer Area */}
            <div className="relative flex-1 flex flex-col items-center justify-center bg-slate-900/50 overflow-hidden select-none p-2 sm:p-4 md:p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">
                            Decrypting Vault Stream...
                        </p>
                    </div>
                ) : material && material.hasAccess ? (
                    <div className={`relative w-full h-full max-w-5xl flex flex-col transition-all duration-700 ${isBlurred ? "blur-2xl grayscale scale-95" : "scale-100"}`}>
                        {pdfUrl ? (
                            <div className="relative flex-1 bg-white rounded-lg shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                                <iframe
                                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full border-0"
                                    title={material.title}
                                />
                                {/* Security Overlay to block right click on iframe */}
                                <div className="absolute inset-0 z-10 pointer-events-none" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                                <AlertTriangle className="h-12 w-12 opacity-20" />
                                <p className="font-bold tracking-widest uppercase text-xs">
                                    {material.fileExists ? "Stream Pending Initial Handshake..." : "Secure Resource Missing from Vault"}
                                </p>
                            </div>
                        )}

                        {/* High-Fidelity Watermark Overlay */}
                        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-[0.03]">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="flex whitespace-nowrap gap-20 py-10 -rotate-12 select-none">
                                    {[...Array(10)].map((_, j) => (
                                        <span key={j} className="text-4xl font-black text-black select-none">
                                            {user.email} • {new Date().toLocaleDateString()} • {user.id.substring(0, 6)}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/20 bg-red-500/10 backdrop-blur-md text-center">
                        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Access Prohibited</h3>
                        <p className="text-red-400/80 mb-6 text-sm">
                            Your credentials do not permit access to this secure resource or the material does not exist in the vault.
                        </p>
                        <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full" onClick={() => router.push('/dashboard/materials')}>
                            Return to Safety
                        </Button>
                    </div>
                )}

                {/* Blur Overlay Message */}
                {isBlurred && !isLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                        <EyeOff className="h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-xl font-bold text-white">Content Hidden</h3>
                        <p className="text-slate-400">Return focus to window to resume studying</p>
                    </div>
                )}
            </div>
        </div>
    )
}
