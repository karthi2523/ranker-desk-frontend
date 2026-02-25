"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, EyeOff, Loader2, ShieldCheck, ShieldAlert, Lock } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import dynamic from "next/dynamic"

// Load PdfSecureViewer client-side ONLY — pdfjs-dist must never run in Node.js (server).
// This is the fix for: "Object.defineProperty called on non-object" from pdfjs-dist v5.
const PdfSecureViewer = dynamic(
    () => import("./PdfSecureViewer").then((m) => m.PdfSecureViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-xs text-slate-500 font-medium animate-pulse">Loading viewer…</p>
            </div>
        ),
    }
)

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
    const [isFlashActive, setIsFlashActive] = useState(false)

    // ─── Security Event Listeners ─────────────────────────────────────────────
    useEffect(() => {
        // Block right-click anywhere on the page
        const handleContextMenu = (e: MouseEvent) => e.preventDefault()

        // Block keyboard shortcuts that could leak the document
        const handleKeyDown = (e: KeyboardEvent) => {
            const blocked =
                e.key === 'PrintScreen' ||
                // Ctrl+P (print), Ctrl+S (save), Ctrl+U (view source), Ctrl+Shift+I (devtools)
                // Ctrl+C is intentionally NOT blocked — it would block all copying across the site
                (e.ctrlKey && ['p', 's', 'u'].includes(e.key.toLowerCase())) ||
                // Meta (Cmd on Mac) equivalents
                (e.metaKey && ['p', 's'].includes(e.key.toLowerCase())) ||
                // F12 devtools, F5 (refresh bypasses history), Ctrl+Shift+I/J/C
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))

            if (blocked) {
                e.preventDefault()
                e.stopPropagation()
                // Visual flash to signal the block
                setIsFlashActive(true)
                setTimeout(() => setIsFlashActive(false), 180)
            }
        }

        // Blur content when tab is hidden (protects against screen-share + tab-switch)
        const handleVisibilityChange = () => setIsBlurred(document.hidden)
        // Blur when the window loses focus (screen recording / alt-tab protection)
        const handleWindowBlur = () => setIsBlurred(true)
        const handleWindowFocus = () => setIsBlurred(false)

        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('keydown', handleKeyDown, true)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('blur', handleWindowBlur)
        window.addEventListener('focus', handleWindowFocus)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('keydown', handleKeyDown, true)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('blur', handleWindowBlur)
            window.removeEventListener('focus', handleWindowFocus)
            // Release the blob URL to free memory
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
        }
    }

    if (!user) return null

    return (
        // overflow-hidden on root — nothing can bleed outside
        <div className="relative h-screen w-full overflow-hidden bg-slate-950 flex flex-col select-none">

            {/* Session Alert Modal */}
            <Modal
                isOpen={showSessionAlert}
                onClose={() => router.push('/dashboard/materials')}
                title="Session Alert"
                description="Session anomaly detected. To protect your vault, this session is being locked."
            >
                <Button className="w-full bg-indigo-600" onClick={() => router.push('/dashboard/materials')}>
                    Return to Dashboard
                </Button>
            </Modal>

            {/* ── Security Status Bar ───────────────────────────────── */}
            <div className="h-8 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between px-4 md:px-6 text-[10px] font-semibold tracking-widest text-indigo-400/80 uppercase shrink-0 select-none">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">Secure Environment</span>
                    <span className="sm:hidden">Secure</span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden truncate text-slate-400/70">
                    <span className="hidden sm:inline text-slate-600">Audited as:</span>
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-amber-500/60 shrink-0" />
                    <span className="hidden sm:inline text-slate-400">Secure Access</span>
                </div>
            </div>

            {/* ── Toolbar ───────────────────────────────────────────── */}
            <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 z-40 shrink-0 select-none">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate">{material?.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Study Vault</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-semibold text-green-500 uppercase tracking-widest whitespace-nowrap">
                            Live Feed
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-400 hover:text-white text-xs hidden sm:flex"
                        onClick={() => router.push('/dashboard/materials')}
                    >
                        ← Exit
                    </Button>
                </div>
            </div>

            {/* ── Main Content Area ─────────────────────────────────── */}
            <div className="relative flex-1 flex flex-col items-center justify-center bg-slate-900/40 overflow-hidden">

                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                        <p className="text-sm font-medium text-slate-400 animate-pulse">
                            Loading secure document…
                        </p>
                    </div>
                ) : material && material.hasAccess ? (
                    /* PDF Viewer — content is hidden instantly on focus loss */
                    <div
                        className={`relative w-full h-full ${isBlurred
                            ? "blur-3xl grayscale brightness-50 scale-95"
                            : ""
                            }`}
                        // No transition:  instant blur = harder to sneak a screenshot
                        style={{ transition: isBlurred ? "none" : "filter 0.4s, transform 0.4s" }}
                    >
                        {pdfUrl ? (
                            <div className="relative w-full h-full">
                                <PdfSecureViewer pdfUrl={pdfUrl} title={material.title} />

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                                <AlertTriangle className="h-12 w-12 opacity-20" />
                                <p className="text-sm font-medium">
                                    {material.fileExists
                                        ? "Preparing stream, please wait…"
                                        : "Document file not found in vault."}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Access Denied */
                    <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/20 bg-red-500/10 backdrop-blur-md text-center">
                        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
                        <p className="text-red-400/80 mb-6 text-sm leading-relaxed">
                            You do not have access to this material. Please purchase it from the store first.
                        </p>
                        <Button
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full"
                            onClick={() => router.push('/dashboard/materials')}
                        >
                            Back to Materials
                        </Button>
                    </div>
                )}

                {/* ── Focus-loss Overlay ── no transition so it appears instantly ─ */}
                {isBlurred && !isLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl">
                        <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 shadow-2xl mb-6">
                            <EyeOff className="h-10 w-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Content Hidden</h3>
                        <p className="text-slate-400 text-sm font-medium">
                            Click back into the window to resume reading
                        </p>
                        <div className="mt-6 px-4 py-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-[11px] font-semibold text-indigo-400 tracking-widest uppercase">
                            Audited: {user.email}
                        </div>
                    </div>
                )}

                {/* ── Keystroke Flash Deterrent ──────────────────────── */}
                {isFlashActive && (
                    <div className="absolute inset-0 z-[200] bg-red-500/10 border-2 border-red-500/30 animate-out fade-out duration-200 pointer-events-none" />
                )}
            </div>
        </div>
    )
}
