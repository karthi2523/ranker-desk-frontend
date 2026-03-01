"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"

interface PdfSecureViewerProps {
    pdfUrl: string
    title?: string
}

export function PdfSecureViewer({ pdfUrl, title }: PdfSecureViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(1.0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState<number>(0)

    // Measure container width to auto-fit PDF on mobile
    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth)
            }
        }
        measure()
        const ro = new ResizeObserver(measure)
        if (containerRef.current) ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    const onDocumentLoadSuccess = useCallback(
        ({ numPages }: { numPages: number }) => {
            setNumPages(numPages)
            setPageNumber(1)
        },
        []
    )

    const prevPage = () => setPageNumber((p) => Math.max(1, p - 1))
    const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1))
    const zoomIn = () => setScale((s) => Math.min(3.0, parseFloat((s + 0.2).toFixed(1))))
    const zoomOut = () => setScale((s) => Math.max(0.5, parseFloat((s - 0.2).toFixed(1))))
    const resetZoom = () => setScale(1.0)

    // Calculate effective page width: fill container, then apply scale
    // On mobile this auto-shrinks the PDF to fit the screen width
    const pageWidth = containerWidth > 0
        ? Math.min(containerWidth - 32, 900) * scale  // 16px padding each side
        : undefined

    return (
        <div className="flex flex-col h-full w-full" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>

            {/* ── Controls toolbar ────────────────────────────────── */}
            <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border shrink-0 select-none z-10 gap-2">

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-text-secondary hover:text-text-primary disabled:opacity-30"
                        onClick={prevPage}
                        disabled={pageNumber <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono text-text-secondary min-w-[56px] text-center tabular-nums">
                        {pageNumber} / {numPages || "—"}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-text-secondary hover:text-text-primary disabled:opacity-30"
                        onClick={nextPage}
                        disabled={!numPages || pageNumber >= numPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-0.5 bg-background/60 border border-white/5 rounded-lg p-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-text-secondary p-0" onClick={zoomOut}>
                        <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <button className="text-[11px] font-mono text-indigo-400 w-10 text-center" onClick={resetZoom}>
                        {Math.round(scale * 100)}%
                    </button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-text-secondary p-0" onClick={zoomIn}>
                        <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-text-muted p-0 ml-0.5" onClick={resetZoom}>
                        <RotateCcw className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* ── Screenshot/Recording restriction notice ── */}
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-red-950/40 border-b border-red-500/20 text-[9px] font-black text-red-400/80 uppercase tracking-[0.2em] select-none shrink-0">
                🔒 Screenshot · Screen Recording · Copy — All Restricted · Watermarked to your account
            </div>

            {/* ── PDF Canvas area ─────────────────────────────────── */}
            <div
                ref={containerRef}
                className="pdf-viewer-area flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center gap-4 py-4 bg-surface-raised/30"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                style={{
                    WebkitOverflowScrolling: 'touch',
                    WebkitTouchCallout: 'none',
                }}
            >
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(err) => console.error("[VaultPDF] load error:", err)}
                    loading={
                        <div className="flex flex-col items-center gap-3 py-24">
                            <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                            <p className="text-xs text-text-muted font-medium animate-pulse">Loading document…</p>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center gap-3 py-24 text-red-400/60">
                            <p className="text-sm font-medium">Failed to load document.</p>
                        </div>
                    }
                >
                    <Page
                        key={`page_${pageNumber}_${scale}`}
                        pageNumber={pageNumber}
                        width={pageWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-lg rounded"
                    />
                </Document>
            </div>
        </div>
    )
}
