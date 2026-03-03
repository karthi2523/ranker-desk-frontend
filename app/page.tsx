"use client"

import { LandingNavbar } from "@/components/layout/LandingNavbar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    Shield,
    Lock,
    Zap,
    BookOpen,
    Award,
    FileText,
    Star,
    Users,
    Target,
    ArrowRight,
    ChevronRight,
    Youtube,
    Instagram,
    Send,
    Facebook,
    MessageCircle
} from "lucide-react"
import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"

export default function Home() {
    const categories = [
        { name: "UPSC / Civil Services", icon: <Award className="h-6 w-6" />, count: "1,200+ Materials" },
        { name: "SSC / CGL / CHSL", icon: <Target className="h-6 w-6" />, count: "2,500+ Materials" },
        { name: "Banking / IBPS / SBI", icon: <Lock className="h-6 w-6" />, count: "1,800+ Materials" },
        { name: "Railways / RRB", icon: <Zap className="h-6 w-6" />, count: "950+ Materials" },
        { name: "Defense / Army / Navy", icon: <Shield className="h-6 w-6" />, count: "600+ Materials" },
        { name: "State Govt Exams", icon: <BookOpen className="h-6 w-6" />, count: "3,200+ Materials" },
    ]

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-surface-raised">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-24 overflow-hidden border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-raised via-background to-background">
                {/* Vibrant Ambient Glows */}
                <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-background text-xs font-black tracking-widest uppercase mb-12 shadow-sm"
                    >
                        <Star className="h-3 w-3 fill-black" />
                        <span>#1 Trusted Platform for Govt Aspirants</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl lg:text-8xl xl:text-[9rem] font-black tracking-tighter mb-8 leading-[0.85]"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">
                            Master Exams.
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-400 to-accent-hover italic drop-shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                            Secure Future.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl lg:text-2xl text-text-muted max-w-3xl mx-auto mb-16 leading-relaxed font-medium tracking-tight"
                    >
                        Access premium, verified, and watermarked study materials for Indian Government Exams.
                        We provide the exact edge you need.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link href="/register">
                            <Button size="lg" className="bg-gradient-to-r from-white to-gray-200 hover:from-white hover:to-white text-background px-12 h-16 text-xl font-black tracking-tight rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] group shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]">
                                Begin Identity Verification
                                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm px-12 h-16 text-xl font-black tracking-tight rounded-xl transition-all hover:border-accent/50 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                Access Vault
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Social Proof Stats */}
                    {/* Platform Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-12 border-t border-border">
                        {[
                            { value: "50K+", label: "Active Students" },
                            { value: "10K+", label: "Study Materials" },
                            { value: "98%", label: "Success Rate" },
                            { value: "24/7", label: "Support" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="text-4xl font-black text-text-primary mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Exam Categories Section */}
            <section id="exams" className="py-24 relative overflow-hidden bg-background">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Study Materials</h2>
                            <h3 className="text-5xl font-black text-text-primary tracking-tight">Select Category</h3>
                            <p className="text-text-muted mt-6 leading-relaxed text-lg font-medium">Premium PDF notes tailored for every major government recruitment board in India.</p>
                        </div>
                        <Link href="/register" className="text-text-primary hover:text-text-secondary font-black tracking-tight flex items-center gap-2 group transition-colors">
                            View All Categories <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, index) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group p-8 bg-surface-raised/30 border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.05)]"
                            >
                                <div className="h-12 w-12 bg-surface flex items-center justify-center mb-8 border border-border group-hover:border-accent/50 group-hover:bg-accent/10 transition-colors">
                                    <div className="text-text-primary group-hover:text-accent transition-colors">{cat.icon}</div>
                                </div>
                                <h4 className="text-2xl font-black text-text-primary tracking-tight mb-2 group-hover:text-accent transition-colors">{cat.name}</h4>
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-6">{cat.count}</p>
                                <Link href="/register">
                                    <Button variant="ghost" className="p-0 h-auto text-text-secondary group-hover:text-accent hover:bg-transparent -ml-1 transition-colors font-bold tracking-tight">
                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-background border-y border-border">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-text-primary">Why Choose All Gov?</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium leading-relaxed">We combine premium content with state-of-the-art security to ensure your study journey is uninterrupted and successful.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: <Shield className="h-6 w-6 text-text-primary group-hover:text-accent transition-colors" />, title: "Cryptographic Watermark", desc: "Your content is uniquely assigned to you with real-time watermarking to prevent unauthorized sharing and protect your license." },
                            { icon: <FileText className="h-6 w-6 text-text-primary group-hover:text-accent transition-colors" />, title: "Verified Publications", desc: "We only host content from top-tier publishers and retired bureaucrats. No junk, just high-yield study notes." },
                            { icon: <Zap className="h-6 w-6 text-text-primary group-hover:text-accent transition-colors" />, title: "Zero-Day Intel", desc: "Get instant alerts for new vacancies, admit cards, and results. Stay one step ahead of the official portals." },
                        ].map((feat, i) => (
                            <motion.div
                                key={feat.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                className="text-left group border-t-2 border-border pt-8 hover:border-accent/50 transition-colors"
                            >
                                <div className="h-12 w-12 bg-surface flex items-center justify-center mb-8 border border-border group-hover:border-accent/50 group-hover:bg-accent/10 transition-colors">
                                    {feat.icon}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-4 text-text-primary group-hover:text-accent transition-colors">{feat.title}</h3>
                                <p className="text-text-muted leading-relaxed font-medium">
                                    {feat.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-background relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Pricing Plans</h2>
                        <h3 className="text-5xl font-black text-text-primary tracking-tight">Pay Per PDF Module</h3>
                        <p className="text-text-muted mt-6 max-w-2xl mx-auto font-medium text-lg leading-relaxed">No subscriptions. Free portal access and alerts. Purchase only premium, verifiable study assets on a per-module basis.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 max-w-6xl mx-auto border border-border bg-background shadow-[0_0_50px_rgba(201,168,76,0.05)]"
                    >
                        {/* Price Range Info */}
                        <div className="lg:col-span-1 p-12 bg-white flex flex-col justify-center border-r border-border">
                            <div className="text-background font-black mb-6 uppercase tracking-widest text-[10px]">Price Range</div>
                            <div className="text-6xl font-black text-background mb-4 tracking-tighter">₹50<span className="text-3xl font-normal text-text-secondary mx-2">-</span>₹1k</div>
                            <p className="text-text-muted font-bold leading-relaxed tracking-tight">
                                Affordable pricing mapped precisely to material density and exam complexity. (Alerts & job updates remain strictly free.)
                            </p>
                        </div>

                        {/* Exam Price Highlights */}
                        <div className="lg:col-span-2 grid sm:grid-cols-2">
                            {[
                                { name: "Micro Assets", price: "Starts at ₹50", desc: "Topic-wise PDFs and quick revision formulas." },
                                { name: "SSC / Bank Capsules", price: "₹150 - ₹350", desc: "Complete syllabus coverage modules." },
                                { name: "UPSC Core Intel", price: "₹500 - ₹850", desc: "In-depth strategic notes from veterans." },
                                { name: "Master Architecture", price: "Ceiling ₹1000", desc: "Unrestricted material access per domain." },
                            ].map((item, i) => (
                                <div key={item.name} className={`p-10 hover:bg-background transition-colors flex flex-col justify-between group ${i % 2 === 0 ? 'border-r border-border' : ''} ${i < 2 ? 'border-b border-border' : ''}`}>
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <h4 className="text-xl font-black tracking-tight text-text-primary group-hover:text-text-secondary transition-colors">{item.name}</h4>
                                        </div>
                                        <div className="text-text-primary font-black text-sm px-4 py-2 border border-border bg-surface inline-block mb-4 tracking-tight">{item.price}</div>
                                        <p className="text-text-muted text-sm font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                    <Link href="/register" className="mt-8 block">
                                        <Button variant="ghost" className="p-0 h-auto text-text-primary group-hover:pl-2 transition-all font-black tracking-tight rounded-none">
                                            Buy Material <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="mt-16 py-6 border-y border-border text-center max-w-6xl mx-auto">
                        <p className="text-text-muted font-bold tracking-tight text-sm flex items-center justify-center gap-3">
                            <Zap className="h-4 w-4 text-text-primary" />
                            LIFETIME ACCESS ON ALL PURCHASED MATERIALS • SECURE PDF DOWNLOADS
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-background border-y border-border">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Our Mission</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-text-primary mb-8 tracking-tight">Setting the Standard Since 2024</h3>
                        <p className="text-text-secondary leading-relaxed mb-10 font-medium text-lg">
                            All Gov started with a strict directive: centralize, secure, and distribute premium study materials. We eradicated data leaks and eliminated hyper-inflated academy fees.
                        </p>
                        <div className="grid grid-cols-2 gap-12 border-t border-border pt-8">
                            <div>
                                <div className="text-4xl font-black text-text-primary tracking-tighter mb-2">50K<span className="text-text-muted">+</span></div>
                                <p className="text-[10px] text-text-muted font-black tracking-widest uppercase">Registered Students</p>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-text-primary tracking-tighter mb-2">1M<span className="text-text-muted">/30</span></div>
                                <p className="text-[10px] text-text-muted font-black tracking-widest uppercase">Successful Exams</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-lg aspect-square bg-background border border-border flex items-center justify-center relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzI3MjcyYSIvPjwvc3ZnPg==')]">
                        <Shield className="h-32 w-32 text-text-primary" />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="border border-border bg-background p-12 md:p-24 text-center relative overflow-hidden group hover:border-accent/30 hover:shadow-[0_0_50px_rgba(201,168,76,0.1)] transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-7xl font-black text-text-primary mb-8 tracking-tighter">Start Learning.</h2>
                            <p className="text-text-muted text-xl max-w-2xl mx-auto mb-12 font-medium tracking-tight">
                                Get immediate access to premium exam materials today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link href="/register">
                                    <Button size="lg" className="bg-white text-background hover:bg-accent-hover px-12 h-16 text-lg font-black tracking-tight rounded-none transition-all active:scale-95">
                                        Sign Up Now
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="bg-background text-text-primary border-border hover:bg-surface px-12 h-16 text-lg font-black tracking-tight rounded-none transition-all">
                                        Log In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-border bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="group flex items-center gap-5 mb-10">
                                <div className="h-16 w-16 border border-border bg-background flex items-center justify-center group-hover:border-slate-500 transition-colors">
                                    <img
                                        src="/logo.png"
                                        alt="Logo"
                                        className="h-8 w-8 object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-text-primary tracking-tighter transition-colors leading-[0.9]">
                                        All government
                                    </span>
                                    <span className="text-[12px] font-black text-text-muted tracking-[0.4em] uppercase mt-2">
                                        Alerts
                                    </span>
                                </div>
                            </Link>
                            <p className="text-text-muted font-bold max-w-sm leading-relaxed mb-8 tracking-tight">
                                India's strict-access platform for government exam study materials. High security. No noise.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { name: "Instagram", href: "https://www.instagram.com/all_government_alerts/", icon: <Instagram className="h-5 w-5" /> },
                                    { name: "YouTube", href: "https://youtube.com/@all_government_alerts", icon: <Youtube className="h-5 w-5" /> },
                                    { name: "WhatsApp", href: "https://whatsapp.com/channel/0029VanToDy3gvWdW6pOsQ3J", icon: <FaWhatsapp className="h-5 w-5" /> },
                                    { name: "Telegram", href: "https://t.me/all_government_alerts", icon: <Send className="h-5 w-5" /> },
                                    { name: "Facebook", href: "https://www.facebook.com/share/1ByyLMZpZN/", icon: <Facebook className="h-5 w-5" /> },
                                ].map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-12 w-12 bg-background border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white transition-all duration-300 hover:scale-110"
                                        title={social.name}
                                    >
                                        {social.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 className="text-text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8">Directories</h5>
                            <div className="flex flex-col gap-5 text-text-muted font-bold text-sm tracking-tight">
                                <Link href="#exams" className="hover:text-text-primary transition-colors">Browse Index</Link>
                                <Link href="#features" className="hover:text-text-primary transition-colors">Spec Sheet</Link>
                                <Link href="#pricing" className="hover:text-text-primary transition-colors">Financials</Link>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8">Protocol</h5>
                            <div className="flex flex-col gap-5 text-text-muted font-bold text-sm tracking-tight">
                                <Link href="/privacy" className="hover:text-text-primary transition-colors">Data Privacy</Link>
                                <Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
                                <Link href="/license" className="hover:text-text-primary transition-colors">License Agreement</Link>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-[10px] text-text-muted font-black tracking-[0.2em] uppercase">
                            © 2026 ALL GOVERNMENT ALERTS. ALL RIGHTS RESERVED.
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 border border-border bg-background">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    )
}
