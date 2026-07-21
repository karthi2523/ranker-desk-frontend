"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Menu, X, ChevronRight, Instagram, Youtube, Send } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
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
                className={`fixed top-0 z-[110] w-full transition-all duration-300 ${isScrolled
                    ? "py-4 bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
                    : "py-6 bg-transparent"
                    }`}
            >
                <nav className="container mx-auto px-6 flex items-center justify-between" aria-label="Global">
                    {/* Logo & Brand */}
                    <div className="flex lg:flex-1">
                        <Link href="/" className="group flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center transition-transform group-hover:scale-105">
                                <img
                                    src="/logo.png"
                                    alt="All Gov Logo"
                                    className="h-8 w-8 object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                                    All Government Alerts
                                </h1>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-1 justify-end gap-6 items-center">
                        <ThemeToggle />
                        {isLoading ? (
                            <div className="h-10 w-24 animate-pulse rounded-md bg-surface border border-border" />
                        ) : user ? (
                            <Link href="/dashboard">
                                <Button className="bg-accent hover:bg-accent-hover text-white gap-2 h-10 px-6 rounded-md font-medium shadow-sm transition-all">
                                    <User className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-text-secondary hover:text-text-primary hover:bg-surface font-medium text-sm h-10 px-5 rounded-md transition-all">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-accent text-white hover:bg-accent-hover h-10 px-6 rounded-md font-medium shadow-sm transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden relative z-[110] p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[105] bg-background md:hidden flex flex-col pt-24"
                    >
                        <div className="relative z-10 flex flex-col h-full overflow-y-auto px-6 pb-12">
                            {/* Mobile Links */}
                            <div className="flex flex-col gap-2 mb-8">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-2xl font-semibold text-text-primary hover:text-accent transition-colors flex items-center justify-between p-4 rounded-lg hover:bg-surface group"
                                        >
                                            {link.name}
                                            <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-auto space-y-8">
                                {/* Auth Actions */}
                                <div className="grid grid-cols-1 gap-3">
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-accent text-white hover:bg-accent-hover h-14 rounded-xl text-lg font-semibold shadow-subtle">
                                            Sign Up
                                        </Button>
                                    </Link>
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-border bg-surface hover:bg-surface-raised text-text-primary h-14 rounded-xl text-lg font-semibold">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>

                                {/* Social Links & Footer */}
                                <div className="pt-6 border-t border-border">
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        {socialLinks.map((social) => (
                                            <Link
                                                key={social.name}
                                                href={social.href}
                                                target="_blank"
                                                className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all active:scale-95"
                                            >
                                                {social.icon}
                                            </Link>
                                        ))}
                                    </div>
                                    <p className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        © {new Date().getFullYear()} All Government Alerts
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
