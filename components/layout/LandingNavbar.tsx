"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, User, Menu, X, ChevronRight, Instagram, Youtube, Send, Facebook } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

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

    const socialLinks = [
        { name: "Instagram", href: "https://www.instagram.com/all_government_alerts/", icon: <Instagram className="h-5 w-5" /> },
        { name: "YouTube", href: "https://youtube.com/@all_government_alerts", icon: <Youtube className="h-5 w-5" /> },
        { name: "WhatsApp", href: "https://whatsapp.com/channel/0029VanToDy3gvWdW6pOsQ3J", icon: <FaWhatsapp className="h-5 w-5" /> },
        { name: "Telegram", href: "https://t.me/all_government_alerts", icon: <Send className="h-5 w-5" /> },
    ]

    return (
        <>
            <header
                className={`fixed top-0 z-[100] w-full transition-all duration-300 ${isScrolled
                    ? "py-3 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
                    : "py-6 bg-transparent"
                    }`}
            >
                <nav className="container mx-auto px-6 flex items-center justify-between" aria-label="Global">
                    {/* Logo & Brand - STARK & MONOCHROMATIC */}
                    <div className="flex lg:flex-1">
                        <Link href="/" className="group flex items-center gap-4">
                            <div className="relative h-11 w-11 rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src="/logo.png"
                                    alt="All Gov Logo"
                                    className="h-6 w-6 object-contain relative z-10 filter brightness-110"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(110deg,#f0f2f5,45%,#c9a84c,55%,#f0f2f5)] bg-[length:200%_100%] animate-shimmer whitespace-nowrap group-hover:scale-[1.02] transition-transform">
                                    All Government Alerts
                                </h1>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[13px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all duration-300 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons - MINIMALIST */}
                    <div className="flex lg:flex-1 justify-end gap-6 items-center">
                        {isLoading ? (
                            <div className="h-10 w-24 animate-pulse rounded-full bg-white/5 border border-white/10" />
                        ) : user ? (
                            <Link href="/dashboard">
                                <Button className="bg-white hover:bg-white/90 text-background gap-2 h-11 px-7 rounded-full font-black tracking-tight transition-all active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                    <User className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <div className="hidden sm:flex items-center gap-4">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-text-muted hover:text-text-primary font-black text-[13px] uppercase tracking-widest h-11 px-6 rounded-full transition-all">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-accent text-background hover:bg-accent-hover h-11 px-8 rounded-full font-black tracking-tight shadow-[0_8px_20px_-6px_rgba(201,168,76,0.3)] transition-all active:scale-95">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden relative z-[110] p-2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-7 w-7 text-white" />
                            ) : (
                                <Menu className="h-7 w-7" />
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Premium Mobile Menu Overlay - OUTSIDE HEADER to fix scroll clipping */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[120] bg-background md:hidden flex flex-col"
                    >
                        {/* Background Decorative Elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-accent/5 rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[100px]" />
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzI3MjcyYSIvPjwvc3ZnPg==')] opacity-20" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full overflow-y-auto px-8 pt-8 pb-12">
                            {/* Mobile Header in Overlay */}
                            <div className="flex items-center justify-between mb-12">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl border border-white/10 bg-background/50 flex items-center justify-center">
                                        <img src="/logo.png" alt="Logo" className="h-5 w-5 object-contain" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(110deg,#f0f2f5,45%,#c9a84c,55%,#f0f2f5)] bg-[length:200%_100%] animate-shimmer whitespace-nowrap">
                                            All Government Alerts
                                        </h2>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-text-muted hover:text-white transition-colors"
                                    aria-label="Close Menu"
                                >
                                    <X className="h-8 w-8 text-white" />
                                </button>
                            </div>
                            {/* Mobile Links */}
                            <div className="flex flex-col gap-6 mb-12">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-4xl font-black tracking-tighter text-text-primary hover:text-accent transition-colors flex items-center justify-between group"
                                        >
                                            {link.name}
                                            <ChevronRight className="h-6 w-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-auto space-y-10">
                                {/* Auth Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-accent text-background hover:bg-accent-hover h-16 rounded-2xl text-xl font-black tracking-tight shadow-xl">
                                            Sign Up
                                        </Button>
                                    </Link>
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-16 rounded-2xl text-xl font-black tracking-tight">
                                            Log In
                                        </Button>
                                    </Link>
                                </motion.div>

                                {/* Social Links & Footer */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="pt-8 border-t border-white/5"
                                >
                                    <div className="flex items-center justify-center gap-6 mb-8">
                                        {socialLinks.map((social) => (
                                            <Link
                                                key={social.name}
                                                href={social.href}
                                                target="_blank"
                                                className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-white transition-all active:scale-90"
                                            >
                                                {social.icon}
                                            </Link>
                                        ))}
                                    </div>
                                    <p className="text-center text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
                                        © 2026 ALL GOVERNMENT ALERTS
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
