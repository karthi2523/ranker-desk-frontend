"use client"

import { LandingNavbar } from "@/components/layout/LandingNavbar"
import { motion } from "framer-motion"
import { Shield, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
                        <Shield className="h-3 w-3" />
                        <span>Data Privacy Hub</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary">
                        Data Privacy & Security Core
                    </h1>

                    <p className="text-xl text-text-muted font-medium mb-16 leading-relaxed">
                        Last Updated: March 2026. Your privacy and security are our top priorities. We do not compromise on data integrity.
                    </p>
                </motion.div>

                <div className="space-y-16">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 border border-border bg-surface/30 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black tracking-tight mb-4 flex items-center gap-3">
                                <Lock className="h-6 w-6 text-accent" />
                                1. Information Collection
                            </h2>
                            <p className="text-text-secondary leading-relaxed font-medium">
                                We gather only essential telemetry and authentication vectors required to establish your student account. This includes your heavily encrypted identity hashes, purchase history logs, and device fingerprints to orchestrate our zero-leak dynamic watermarking system.
                            </p>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-black tracking-tight text-text-primary">2. Security Infrastructure</h2>
                        <ul className="space-y-4 text-text-secondary font-medium list-disc list-inside">
                            <li>To inject unique, trace-capable watermarks directly into asset binaries upon requesting rendering.</li>
                            <li>To facilitate end-to-end encrypted storage pipelines utilizing AES-256 logic.</li>
                            <li>To execute multi-node anomaly detection preventing large scale exfiltration attempts.</li>
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-black tracking-tight text-text-primary">3. Third-Party Deployment</h2>
                        <p className="text-text-secondary leading-relaxed font-medium">
                            Your operational data is never sold, traded, or compromised to commercial entities. Data transmission only occurs via secure API relays to validated payment processors and necessary infrastructure hosting environments under strict SLA constraints.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-black tracking-tight text-text-primary">4. User Data Rights</h2>
                        <p className="text-text-secondary leading-relaxed font-medium">
                            You maintain ultimate control over your data footprint. You hold the right to petition for a full data wipe (Account Deletion), which immediately cascades and erases all non-transactional database references. Note: Any previously watermarked study materials downloaded will retain its trace markers permanently.
                        </p>
                    </motion.section>
                </div>

                <div className="mt-20 pt-10 border-t border-border flex justify-between items-center">
                    <Link href="/">
                        <Button variant="ghost" className="text-text-muted hover:text-text-primary font-bold tracking-tight px-0">
                            ← Back to Home
                        </Button>
                    </Link>
                    <Link href="/terms">
                        <Button variant="ghost" className="text-accent hover:text-accent-hover font-bold tracking-tight group px-0">
                            View Terms of Service <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}
