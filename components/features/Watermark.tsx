"use client"

import { useEffect, useState } from"react"

interface WatermarkProps {
 text: string
 subtext: string
}

export function Watermark({ text, subtext }: WatermarkProps) {
 const [position, setPosition] = useState({ x: 0, y: 0 })

 useEffect(() => {
 // Subtle jitter to prevent pixel-perfect removal
 const interval = setInterval(() => {
 setPosition({
 x: (Math.random() - 0.5) * 40,
 y: (Math.random() - 0.5) * 40
 })
 }, 8000)
 return () => clearInterval(interval)
 }, [])

 return (
 <div className="pointer-events-none absolute inset-0 z-[100] flex items-center justify-center overflow-hidden opacity-[0.04] mix-blend-multiply">
 <div
 className="flex h-[300%] w-[300%] flex-wrap content-center justify-center gap-x-32 gap-y-40 -rotate-[25deg] transition-transform duration-[8000ms] ease-in-out"
 style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(-25deg)` }}
 >
 {Array.from({ length: 60 }).map((_, i) => (
 <div key={i} className="flex flex-col items-start justify-center whitespace-nowrap text-slate-900 select-none">
 <div className="flex items-center gap-2">
 <span className="text-2xl font-black uppercase tracking-[0.15em]">{text}</span>
 <span className="h-1.5 w-1.5 rounded-full bg-surface mx-2"/>
 <span className="text-xl font-medium font-mono">{subtext}</span>
 </div>
 <div className="mt-1 flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase italic opacity-60">
 <span>Sovereign Security Node</span>
 <span>•</span>
 <span>Access: {new Date().toLocaleDateString('en-IN')}</span>
 <span>•</span>
 <span>Encrypted Stream Active</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )
}
