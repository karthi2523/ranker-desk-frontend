"use client"

import { useState, useCallback, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// react-pdf v7 / pdfjs-dist v3.11.174
// Worker is pre-copied to /public/pdf.worker.min.js via next.config.mjs (or manually).
// /public path avoids any import.meta or ESM resolution issues.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"

interface PdfSecureViewerProps {
    pdfUrl: string
    title?: string
}

export function PdfSecureViewer({ pdfUrl, title }: PdfSecureViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(1.2)
    const containerRef = useRef<HTMLDivElement>(null)

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
    const resetZoom = () => setScale(1.2)

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">

            {/* ── Controls toolbar ────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0 select-none z-10">

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-30"
                        onClick={prevPage}
                        disabled={pageNumber <= 1}
                        title="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono text-slate-300 px-2 min-w-[80px] text-center tabular-nums">
                        {pageNumber} / {numPages || "—"}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-30"
                        onClick={nextPage}
                        disabled={!numPages || pageNumber >= numPages}
                        title="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-0.5 bg-slate-950/60 border border-white/5 rounded-lg p-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-white p-0"
                        onClick={zoomOut}
                        title="Zoom out"
                    >
                        <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <button
                        className="text-[11px] font-mono text-indigo-400 w-12 text-center hover:text-indigo-300 transition-colors"
                        onClick={resetZoom}
                        title="Reset zoom"
                    >
                        {Math.round(scale * 100)}%
                    </button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-white p-0"
                        onClick={zoomIn}
                        title="Zoom in"
                    >
                        <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-white p-0 ml-0.5"
                        onClick={resetZoom}
                        title="Reset zoom"
                    >
                        <RotateCcw className="h-3 w-3" />
                    </Button>
                </div>

                {/* Spacer for balance */}
                <div className="min-w-[80px]" />
            </div>

            {/* ── PDF Canvas area ──────────────────────────────────── */}
            {/*
              Security hardening:
              - onContextMenu: blocks right-click → no "Save Image As"
              - onDragStart: prevents dragging the rendered canvas image
              - CSS in globals.css: user-select:none + pointer-events:none on all canvas
              - renderTextLayer=false: no selectable/copyable text layer rendered
              - renderAnnotationLayer=false: no clickable links that could leak URLs
              - One page at a time: full PDF is never in accessible DOM at once
            */}
            <div
                ref={containerRef}
                className="pdf-viewer-area flex-1 overflow-y-auto overflow-x-auto flex flex-col items-center gap-4 py-6 bg-slate-800/30"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
            >
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(err) => console.error("[VaultPDF] load error:", err)}
                    loading={
                        <div className="flex flex-col items-center gap-3 py-24">
                            <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                            <p className="text-xs text-slate-500 font-medium animate-pulse">
                                Loading document…
                            </p>
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
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-2xl"
                    />
                </Document>
            </div>
        </div>
    )
}
