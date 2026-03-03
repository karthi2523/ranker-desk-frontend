"use client"

import { LandingNavbar } from "@/components/layout/LandingNavbar"
import { motion } from "framer-motion"
import { Award, Zap, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LicensePage() {
    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-surface-raised flex flex-col">
            <LandingNavbar />

            <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-widest uppercase mb-8">
                        <Award className="h-3 w-3" />
                        <span>Usage License</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary">
                        End-User License Agreement (EULA)
                    </h1>

                    <p className="text-xl text-text-muted font-medium mb-16 leading-relaxed">
                        Last Updated: March 2026. This defines the rules for using the study materials provided by All Gov.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-accent/5 border border-accent/20 p-8 rounded-xl"
                    >
                        <Zap className="h-8 w-8 text-accent mb-6" />
                        <h3 className="text-2xl font-black text-white mb-4">Authorized Use</h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            You are authorized to read and study the materials provided via our proprietary web-based PDF viewer interfaces. You may access this data across your personal fleet of mobile and desktop devices.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-red-500/5 border border-red-500/20 p-8 rounded-xl"
                    >
                        <BookOpen className="h-8 w-8 text-red-400 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-4">Prohibited Actions</h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            Bypass of DRM (Digital Rights Management), extraction via automated scraping, unapproved API routing, localized printing, screenshot capturing, and screen recording processes are fundamentally banned and blocked at the engine layer.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-8">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-black tracking-tight text-white mb-4 flex items-center gap-2">
                            Intellectual Property Rights
                        </h2>
                        <p className="text-text-secondary leading-relaxed font-medium">
                            The architecture, branding layout, aggregated intelligence notes, structured exam capsules, and all associated code vectors are the exclusive property of All Gov and its verified contributor network. Obtaining a license to view this content transfers zero ownership rights.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-black tracking-tight text-white mb-4 flex items-center gap-2">
                            Monitoring and Enforcement
                        </h2>
                        <p className="text-text-secondary leading-relaxed font-medium">
                            Our system monitors for anomalous behavior. Should your cryptographic watermark be detected in wild leaks across external boards or social networks (Telegram, WhatsApp, etc.), we retain the permanent right to dispatch a localized takedown notice and initiate legal damages based on intellectual property theft laws.
                        </p>
                    </motion.section>
                </div>

                <div className="mt-20 pt-10 border-t border-border flex justify-between items-center">
                    <Link href="/">
                        <Button variant="ghost" className="text-text-muted hover:text-white font-bold tracking-tight px-0">
                            ← Back to Home
                        </Button>
                    </Link>
                    <Link href="/privacy">
                        <Button variant="ghost" className="text-accent hover:text-accent-hover font-bold tracking-tight group px-0">
                            Review Privacy Policy <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}
