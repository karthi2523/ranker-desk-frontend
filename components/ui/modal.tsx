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
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
 if (!isOpen) return null

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
 <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-none">
 <div className="flex items-center justify-between pb-4">
 <div>
 <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
 {description && <p className="text-sm text-text-secondary">{description}</p>}
 </div>
 <Button variant="ghost"size="icon"onClick={onClose} className="h-8 w-8 text-text-secondary hover:text-text-primary">
 <X className="h-4 w-4"/>
 </Button>
 </div>
 <div className="text-text-secondary">
 {children}
 </div>
 </div>
 </div>
 )
}
