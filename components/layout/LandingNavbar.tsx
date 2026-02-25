"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Menu, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"

export function LandingNavbar() {
    const { user, isLoading } = useAuth()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
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
                    ? "py-3 bg-[#0a0e1a] border-b border-[#1e2d45]"
                    : "py-5 bg-transparent"
                }`}
        >
            <nav className="container mx-auto px-6 flex items-center justify-between" aria-label="Global">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg overflow-hidden border border-[#1e2d45]">
                            <img src="/logo.png" alt="All Government Alerts" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-base font-bold text-[#f0f2f5] tracking-tight">
                                All Government
                            </span>
                            <span className="text-[9px] font-bold text-[#c9a84c] tracking-[0.25em] uppercase">
                                Alerts Platform
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-[#8a9bb0] hover:text-[#f0f2f5] transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c9a84c] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex lg:flex-1 justify-end gap-3 items-center">
                    {isLoading ? (
                        <div className="h-9 w-24 animate-pulse rounded-lg bg-[#1a2235]" />
                    ) : user ? (
                        <Link href="/dashboard">
                            <Button className="gap-2">
                                <User className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" className="text-sm">Log In</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 text-[#8a9bb0] hover:text-[#f0f2f5] transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-[-1] bg-[#0a0e1a] transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                    }`}
            >
                <div className="flex flex-col items-center justify-center h-full gap-7 p-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-2xl font-bold text-[#f0f2f5] hover:text-[#c9a84c] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="w-full h-px bg-[#1e2d45] max-w-xs my-2" />
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs text-center">
                        <span className="text-lg font-semibold text-[#8a9bb0] hover:text-[#f0f2f5] cursor-pointer">Log In</span>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs">
                        <Button className="w-full h-12 text-base rounded-xl">Get Started</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
