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
            className={`fixed top-0 z-[100] w-full transition-all duration-500 ${isScrolled
                ? "py-3 bg-slate-950/70 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/80"
                : "py-6 bg-transparent"
                }`}
        >
            <nav className="container mx-auto px-6 flex items-center justify-between" aria-label="Global">
                {/* Logo & Brand - PROFESSIONAL & CLEAN */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="group flex items-center gap-4">
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/10 border border-white/5 transition-transform duration-300 group-hover:scale-105">
                            <img
                                src="/logo.png"
                                alt="All Government Alerts Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-extrabold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                                All Government
                            </span>
                            <span className="text-[10px] font-bold text-indigo-500/80 tracking-[0.3em] uppercase">
                                Alerts Platform
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation - CLEAN & BALANCED */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors tracking-tight relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons - PROFESSIONAL RESTRAINT */}
                <div className="flex lg:flex-1 justify-end gap-5 items-center">
                    {isLoading ? (
                        <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-800" />
                    ) : user ? (
                        <Link href="/dashboard">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-10 px-6 rounded-lg font-bold shadow-lg shadow-indigo-500/10 transition-all active:scale-95">
                                <User className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" className="text-slate-400 hover:text-white font-semibold text-sm hover:bg-white/5 h-10 px-5 rounded-lg transition-all">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-white text-indigo-700 hover:bg-indigo-50 h-10 px-6 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay - CLEAN TRANSITION */}
            <div className={`fixed inset-0 z-[-1] bg-slate-950/98 backdrop-blur-xl transition-all duration-500 md:hidden ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                }`}>
                <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-bold text-white hover:text-indigo-500 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="w-full h-px bg-white/5 my-4 max-w-xs" />
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs text-center">
                        <span className="text-xl font-bold text-slate-400 hover:text-white cursor-pointer">Log In</span>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs">
                        <Button className="w-full bg-indigo-600 text-white h-14 rounded-xl text-xl font-bold">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
