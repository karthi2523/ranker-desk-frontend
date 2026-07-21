"use client"

import { LandingNavbar } from "@/components/layout/LandingNavbar"
import { motion } from "framer-motion"
import { FileText, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
                        <FileText className="h-3 w-3" />
                        <span>Legal Documentation</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary">
                        Terms of Service
                    </h1>

                    <p className="text-xl text-text-muted font-medium mb-16 leading-relaxed">
                        Last Updated: March 2026. By accessing and using the All Gov platform, you automatically agree to the following rigorous operational terms.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {[
                        {
                            title: "1. Material Acceptance & License",
                            desc: "All content provided within this architecture is classified as premium study material, not legal counsel. Your purchase grants you a singular, non-transferable, revocable license strictly for personal exam preparation."
                        },
                        {
                            title: "2. Anti-Distribution Policy",
                            desc: "Under no circumstances are you permitted to redistribute, broadcast, mirror, screenshot, or record our platform assets. Every PDF and document is embedded with cryptographic watermarks linked directly to your user hash. Unauthorized distribution will trigger immediate account termination without refund and potential legal escalation."
                        },
                        {
                            title: "3. Service Availability",
                            desc: "While we strive for a 99.9% uptime metric, the All Gov platform is provided 'as is'. We reserve the right to initiate unscheduled maintenance protocols, modify content architectures, and adjust pricing parameters dynamically without prior warning."
                        },
                        {
                            title: "4. Account Security Rules",
                            desc: "You are the sole commander of your login credentials. Sharing vault access is a direct violation of our security policies. The system employs concurrent-session disruption, automatically terminating active sessions if simultaneous logins are detected from unfamiliar vectors."
                        },
                        {
                            title: "5. Refund Policy",
                            desc: "All transactions processed for digital assets are final. Due to the rapid delivery and immediate consumption nature of exam intel, we operate a strict zero-refund policy once an asset has been decrypted and served to your device."
                        }
                    ].map((section, i) => (
                        <motion.section
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface/20 border border-border p-8 hover:border-white/20 transition-colors"
                        >
                            <h2 className="text-xl font-black tracking-tight text-text-primary mb-4 flex items-center gap-2">
                                <ChevronRight className="h-5 w-5 text-accent" />
                                {section.title}
                            </h2>
                            <p className="text-text-secondary leading-relaxed font-medium pl-7">
                                {section.desc}
                            </p>
                        </motion.section>
                    ))}
                </div>

                <div className="mt-20 pt-10 border-t border-border flex justify-between items-center">
                    <Link href="/">
                        <Button variant="ghost" className="text-text-muted hover:text-text-primary font-bold tracking-tight px-0">
                            ← Back to Home
                        </Button>
                    </Link>
                    <Link href="/license">
                        <Button variant="ghost" className="text-accent hover:text-accent-hover font-bold tracking-tight group px-0">
                            View License Agreement <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}
