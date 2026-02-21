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
    const [isFlashActive, setIsFlashActive] = useState(false)
    const [zoom, setZoom] = useState(100)

    // Security Event Listeners
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault()
        const handleKeyDown = (e: KeyboardEvent) => {
            // Block PrintScreen, Ctrl+P, Ctrl+S, Ctrl+U, F12
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'c')) ||
                e.key === 'F12'
            ) {
                e.preventDefault()
                setIsFlashActive(true)
                setTimeout(() => setIsFlashActive(false), 200)
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

            {/* Premium Viewer Toolbar */}
            <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-40">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-white truncate max-w-[200px]">{material?.title}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Digital Asset Vault</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-400 hover:text-white"
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                    >
                        -
                    </Button>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 w-12 text-center">{zoom}%</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-400 hover:text-white"
                        onClick={() => setZoom(Math.min(200, zoom + 10))}
                    >
                        +
                    </Button>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black text-green-500 uppercase">Stream Healthy</span>
                    </div>
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
                            <div
                                className="relative flex-1 bg-white rounded-lg shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-300"
                                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                            >
                                <iframe
                                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full border-0 pointer-events-none"
                                    title={material.title}
                                />
                                {/* Security Overlay to block interaction with iframe */}
                                <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
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
                        <Watermark
                            text={user.email}
                            subtext={`UID-${user.id.substring(0, 8).toUpperCase()}`}
                        />
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
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all duration-500">
                        <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 shadow-2xl mb-6">
                            <EyeOff className="h-10 w-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight mb-2">Secure Shield Active</h3>
                        <p className="text-slate-500 font-medium">Content is hidden while vault is out of focus</p>
                        <div className="mt-8 px-4 py-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Official Audit: {user.id.substring(0, 12)}
                        </div>
                    </div>
                )}

                {/* Visual Flash Security Deterrent */}
                {isFlashActive && (
                    <div className="absolute inset-0 z-[200] bg-white animate-out fade-out duration-200" />
                )}
            </div>
        </div>
    )
}
