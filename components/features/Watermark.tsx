"use client"

import { useEffect, useState } from "react"

interface WatermarkProps {
    text: string
    subtext: string
}

export function Watermark({ text, subtext }: WatermarkProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        // Animate watermark position slowly to prevent static removal tools
        const interval = setInterval(() => {
            setPosition({
                x: Math.random() * 20,
                y: Math.random() * 20
            })
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden opacity-10">
            <div
                className="flex h-[200%] w-[200%] flex-wrap content-center justify-center gap-24 rotate-[-30deg]"
                style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(-30deg)` }}
            >
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-center whitespace-nowrap text-slate-300 select-none">
                        <span className="text-xl font-bold uppercase tracking-widest">{text}</span>
                        <span className="text-sm font-mono">{subtext}</span>
                        <span className="text-xs">{new Date().toISOString().split('T')[0]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
