"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Watermark } from "./Watermark"
import { AlertTriangle, EyeOff, Loader2, ShieldCheck, ShieldAlert, Lock, Search } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import dynamic from "next/dynamic"

// Load PdfSecureViewer client-side ONLY — pdfjs-dist must never run in Node.js (server).
// This is the fix for:"Object.defineProperty called on non-object"from pdfjs-dist v5.
const PdfSecureViewer = dynamic(
    () => import("./PdfSecureViewer").then((m) => m.PdfSecureViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="text-xs text-text-muted font-medium animate-pulse">Loading viewer…</p>
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
    const [zoom, setZoom] = useState(100)

    // ─── Security Event Listeners ─────────────────────────────────────────────
    useEffect(() => {
        // Block right-click anywhere on the page
        const handleContextMenu = (e: MouseEvent) => e.preventDefault()

        // Block keyboard shortcuts that could leak the document
        const handleKeyDown = (e: KeyboardEvent) => {
            const blocked =
                e.key === 'PrintScreen' ||
                // Ctrl+P (print), Ctrl+S (save), Ctrl+U (view source), Ctrl+Shift+I (devtools)
                (e.ctrlKey && ['p', 's', 'u', 'c'].includes(e.key.toLowerCase())) ||
                // Meta (Cmd on Mac) equivalents
                (e.metaKey && ['p', 's', 'c'].includes(e.key.toLowerCase())) ||
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
        <div
            className="relative h-screen w-full overflow-hidden bg-background flex flex-col select-none"
            style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
            } as React.CSSProperties}
        >
            {/* Security Alert Modal */}
            <Modal
                isOpen={showSessionAlert}
                onClose={() => router.back()}
                title="Sovereign Shield: Session Alert"
                description="Session anomaly detected. To protect your vault, this session is being locked."
            >
                <Button className="w-full bg-accent-hover" onClick={() => router.back()}>
                    Return to Dashboard
                </Button>
            </Modal>

            {/* ── Security Status Bar ───────────────────────────────── */}
            <div className="h-8 bg-accent/10 border-b border-accent/20 flex items-center justify-between px-4 md:px-6 text-[10px] font-semibold tracking-widest text-accent/80 uppercase shrink-0 select-none">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">Secure Environment</span>
                    <span className="sm:hidden">Secure</span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden truncate text-text-secondary/70">
                    <span className="hidden sm:inline text-text-muted">Audited as:</span>
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-accent/60 shrink-0" />
                    <span className="hidden sm:inline text-text-secondary">Secure Access</span>
                </div>
            </div>

            {/* ── Toolbar ───────────────────────────────────────────── */}
            <div className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 z-40 shrink-0 select-none">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-text-primary truncate">{material?.title}</span>
                        <span className="text-[10px] text-text-muted font-medium">Digital Asset Vault</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2 bg-background/50 p-1 rounded-xl border border-border">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 md:h-8 md:w-8 text-text-secondary hover:text-text-primary p-0"
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                    >
                        -
                    </Button>
                    <span className="text-[9px] md:text-[10px] font-mono font-bold text-accent w-8 md:w-12 text-center">{zoom}%</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 md:h-8 md:w-8 text-text-secondary hover:text-text-primary p-0"
                        onClick={() => setZoom(Math.min(200, zoom + 10))}
                    >
                        +
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[9px] font-semibold text-accent uppercase tracking-widest whitespace-nowrap">
                            Stream Active
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-text-secondary hover:text-text-primary text-xs hidden sm:flex"
                        onClick={() => router.back()}
                    >
                        Exit
                    </Button>
                </div>
            </div>

            {/* ── Main Content Area ─────────────────────────────────── */}
            <div className="relative flex-1 flex flex-col bg-surface/40 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>

                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                        <p className="text-sm font-medium text-text-secondary animate-pulse uppercase tracking-widest">
                            Decrypting Vault Stream...
                        </p>
                    </div>
                ) : material && material.hasAccess ? (
                    <div
                        className={`relative w-full flex-1 min-h-0 flex flex-col items-center ${isBlurred
                            ? "blur-3xl grayscale brightness-50"
                            : ""
                            }`}
                        style={{
                            transition: isBlurred ? "none" : "filter 0.4s",
                        }}
                    >
                        {pdfUrl ? (
                            <div
                                className="relative flex-1 w-full bg-background shadow-none overflow-auto"
                                style={{
                                    zoom: `${zoom}%`,
                                }}
                            >
                                <PdfSecureViewer pdfUrl={pdfUrl} title={material.title} />

                                {/* Watermark Overlay */}
                                <Watermark
                                    text={user.email}
                                    subtext={`UID-${user.id.substring(0, 8).toUpperCase()}`}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 gap-4 text-text-muted">
                                <AlertTriangle className="h-12 w-12 opacity-20" />
                                <p className="text-sm font-medium uppercase tracking-widest">
                                    {material.fileExists
                                        ? "Preparing stream, please wait…"
                                        : "Secure Resource Missing from Vault"}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Access Denied */
                    <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/20 bg-red-500/10 text-center">
                        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight">Access Prohibited</h3>
                        <p className="text-red-400/80 mb-6 text-sm leading-relaxed">
                            Your credentials do not permit access to this secure resource or the material does not exist in the vault.
                        </p>
                        <Button
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full"
                            onClick={() => router.back()}
                        >
                            Return to Safety
                        </Button>
                    </div>
                )}

                {/* ── Focus-loss Overlay ── no transition so it appears instantly ─ */}
                {isBlurred && !isLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95">
                        <div className="h-20 w-20 rounded-full bg-surface flex items-center justify-center border border-border shadow-none mb-6">
                            <EyeOff className="h-10 w-10 text-text-muted" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Secure Shield Active</h3>
                        <p className="text-text-secondary text-sm font-medium">
                            Content is hidden while vault is out of focus
                        </p>
                        <div className="mt-6 px-4 py-2 rounded-xl border border-accent/20 bg-accent/5 text-[10px] font-bold text-accent tracking-widest uppercase">
                            Official Audit: {user.id.substring(0, 12)}
                        </div>
                    </div>
                )}

                {/* ── Visual Flash Security Deterrent ──────────────────────── */}
                {isFlashActive && (
                    <div className="absolute inset-0 z-[200] bg-red-500/10 border-2 border-red-500/30 animate-out fade-out duration-200 pointer-events-none" />
                )}
            </div>
        </div>
    )
}
