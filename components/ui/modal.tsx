"use client"

import * as React from"react"
import { cn } from"@/lib/utils"
import { X } from"lucide-react"
import { Button } from"./button"

interface ModalProps {
 isOpen: boolean
 onClose: () => void
 title: string
 children: React.ReactNode
 description?: string
 className?: string
 hideHeader?: boolean
}

export function Modal({ isOpen, onClose, title, description, className, hideHeader, children }: ModalProps) {
 if (!isOpen) return null

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
 <div className={cn("relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-none", !hideHeader && "p-6", hideHeader && "p-0 overflow-hidden", className)}>
 {!hideHeader && (
 <div className="flex items-center justify-between pb-4">
 <div>
 <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
 {description && <p className="text-sm text-text-secondary">{description}</p>}
 </div>
 <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-text-secondary hover:text-text-primary">
 <X className="h-4 w-4"/>
 </Button>
 </div>
 )}
 {hideHeader && (
 <Button 
 variant="ghost" 
 size="icon" 
 onClick={onClose} 
 className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
 >
 <X className="h-4 w-4"/>
 </Button>
 )}
 <div className={cn("text-text-secondary", hideHeader && "h-full")}>
 {children}
 </div>
 </div>
 </div>
 )
}
