"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, User, Menu, X, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"

export function LandingNavbar() {
    const { user, isLoading } = useAuth()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Exams", href: "#exams" },
        { name: "Pricing", href: "#pricing" },
        { name: "About", href: "#about" },
    ]

    return (
        <header
            className={`fixed top-0 z-[100] w-full transition-all duration-300 ${isScrolled
                ? "py-4 bg-background border-b border-border"
                : "py-6 bg-transparent"
                }`}
        >
            <nav className="container mx-auto px-6 flex items-center justify-between" aria-label="Global">
                {/* Logo & Brand - STARK & MONOCHROMATIC */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="group flex items-center gap-4">
                        <div className="relative h-11 w-11 rounded-xl border border-border bg-background flex items-center justify-center transition-transform duration-300 group-hover:border-slate-500">
                            <img
                                src="/logo.png"
                                alt="All Gov Logo"
                                className="h-6 w-6 object-contain grayscale opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-black text-text-primary tracking-tight transition-colors">
                                All Gov
                            </span>
                            <span className="text-[10px] font-black text-text-muted tracking-[0.3em] uppercase">
                                Platform
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors tracking-tight relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons - MINIMALIST */}
                <div className="flex lg:flex-1 justify-end gap-5 items-center">
                    {isLoading ? (
                        <div className="h-9 w-24 animate-pulse rounded-lg bg-surface" />
                    ) : user ? (
                        <Link href="/dashboard">
                            <Button className="bg-white hover:bg-accent-hover text-background gap-2 h-10 px-6 rounded-lg font-black tracking-tight transition-all active:scale-95">
                                <User className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" className="text-text-secondary hover:text-text-primary font-bold text-sm h-10 px-5 rounded-lg transition-all">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-accent text-background hover:bg-accent-hover h-10 px-6 rounded-lg font-black tracking-tight text-sm transition-all active:scale-95">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[-1] bg-background transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                }`}>
                <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-black tracking-tight text-text-primary hover:text-text-secondary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="w-full h-px bg-surface my-4 max-w-xs" />
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs text-center">
                        <span className="text-xl font-black text-text-secondary hover:text-accent cursor-pointer tracking-tight">Log In</span>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs">
                        <Button className="w-full bg-accent text-background hover:bg-accent-hover h-14 rounded-xl text-xl font-black tracking-tight">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
