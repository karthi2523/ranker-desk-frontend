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
    ArrowRight,
    Youtube,
    Instagram,
    Send,
    Facebook,
    Target
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
        <div className="min-h-screen bg-background text-text-primary selection:bg-accent-muted selection:text-accent">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-surface">
                {/* Clean dot pattern background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                
                <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-text-secondary text-sm font-medium mb-8 shadow-subtle"
                    >
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span>Trusted by over 50,000 aspirants nationwide</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 text-text-primary leading-[1.1]"
                    >
                        Master Your Exams.<br/>
                        <span className="text-accent">Secure Your Future.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg lg:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Access high-quality, verified study materials for Indian Government Exams. Designed to help you focus and succeed.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/register">
                            <Button size="lg" className="bg-accent hover:bg-accent-hover text-white px-8 h-14 text-base font-semibold rounded-lg shadow-float transition-all">
                                Start Learning Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="bg-surface border-border hover:bg-surface-raised text-text-primary px-8 h-14 text-base font-semibold rounded-lg transition-all">
                                View Demo
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Platform Stats */}
            <section className="border-y border-border bg-surface-raised">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
                        {[
                            { value: "50K+", label: "Active Students" },
                            { value: "10K+", label: "Study Materials" },
                            { value: "98%", label: "Success Rate" },
                            { value: "24/7", label: "Expert Support" },
                        ].map((stat, i) => (
                            <div key={stat.label} className="px-4">
                                <div className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">{stat.value}</div>
                                <div className="text-sm text-text-muted font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="exams" className="py-24 bg-surface">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Study Materials</h2>
                            <h3 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">Browse by Category</h3>
                            <p className="text-text-muted mt-4 text-lg">Find the exact study notes you need for any major government exam in India.</p>
                        </div>
                        <Link href="/register" className="text-accent hover:text-accent-hover font-medium flex items-center gap-2 group transition-colors">
                            View All Categories <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, index) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group p-8 bg-surface-raised border border-border rounded-2xl shadow-subtle hover:shadow-float hover:border-accent/30 transition-all duration-300"
                            >
                                <div className="h-12 w-12 bg-accent-muted rounded-xl flex items-center justify-center mb-6 text-accent">
                                    {cat.icon}
                                </div>
                                <h4 className="text-xl font-bold text-text-primary mb-2">{cat.name}</h4>
                                <p className="text-sm text-text-muted font-medium mb-6">{cat.count}</p>
                                <Link href="/register">
                                    <span className="text-accent group-hover:text-accent-hover font-medium text-sm flex items-center transition-colors">
                                        Explore Collection <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-surface-raised">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 tracking-tight text-text-primary">
                            Why Choose All Government Alerts?
                        </h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">We combine premium content with state-of-the-art security to ensure your study journey is uninterrupted and successful.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: <Shield className="h-6 w-6" />, title: "Secure Downloads", desc: "Every file you download is securely protected and linked to your account, ensuring a safe and personal learning experience." },
                            { icon: <FileText className="h-6 w-6" />, title: "Trusted Sources", desc: "Study from materials created by experienced educators and top publishers. Get only the best notes without any extra fluff." },
                            { icon: <Zap className="h-6 w-6" />, title: "Instant Updates", desc: "Receive immediate notifications for new job openings, admit cards, and exam results. Never miss an important deadline again." },
                        ].map((feat, i) => (
                            <motion.div
                                key={feat.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                className="text-left"
                            >
                                <div className="h-12 w-12 bg-accent-muted text-accent rounded-xl flex items-center justify-center mb-6">
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text-primary">{feat.title}</h3>
                                <p className="text-text-muted leading-relaxed">
                                    {feat.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-surface">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Pricing Plans</h2>
                        <h3 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">Pay Only For What You Need</h3>
                        <p className="text-text-muted mt-4 max-w-2xl mx-auto text-lg">No expensive subscriptions. Get free access to alerts and pay only for the specific study notes you want to download.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-surface-raised rounded-3xl border border-border shadow-float overflow-hidden flex flex-col lg:flex-row"
                    >
                        <div className="lg:w-1/3 p-10 bg-accent text-white flex flex-col justify-center">
                            <div className="font-semibold mb-4 text-accent-muted text-sm uppercase tracking-wider">Affordable Pricing</div>
                            <div className="text-5xl font-bold mb-6 tracking-tight">₹50 - ₹1k</div>
                            <p className="text-accent-muted text-sm leading-relaxed mb-8">
                                Our materials are priced fairly based on the exam and content size. All exam alerts and job updates are completely free.
                            </p>
                            <Button className="w-full bg-surface text-accent hover:bg-surface-raised font-semibold h-12 rounded-lg text-base">
                                View Catalog
                            </Button>
                        </div>
                        
                        <div className="lg:w-2/3 p-10 grid sm:grid-cols-2 gap-8">
                            {[
                                { name: "Quick Revisions", price: "Starts at ₹50", desc: "Topic-wise PDFs and quick revision formulas." },
                                { name: "Complete Syllabus Guides", price: "₹150 - ₹350", desc: "Everything you need for comprehensive exam preparation." },
                                { name: "In-Depth Study Notes", price: "₹500 - ₹850", desc: "Detailed, high-quality notes from experienced educators." },
                                { name: "Full Access Passes", price: "Max ₹1000", desc: "Complete access to all materials for a specific exam." },
                            ].map((item) => (
                                <div key={item.name} className="flex flex-col">
                                    <h4 className="text-lg font-bold text-text-primary mb-2">{item.name}</h4>
                                    <div className="text-accent font-semibold text-sm mb-3">{item.price}</div>
                                    <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-surface-raised border-y border-border">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-6 tracking-tight">Ready to Start Learning?</h2>
                    <p className="text-text-muted text-lg mb-10">
                        Join over 50,000 students and get immediate access to premium exam materials today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="bg-accent text-white hover:bg-accent-hover px-10 h-14 text-base font-semibold rounded-lg transition-all shadow-subtle">
                                Create Free Account
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="bg-surface text-text-primary border-border hover:bg-surface-raised px-10 h-14 text-base font-semibold rounded-lg transition-all">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-surface">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-6">
                                <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                                <span className="text-xl font-bold text-text-primary tracking-tight">All Government Alerts</span>
                            </Link>
                            <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-8">
                                India's trusted platform for high-quality government exam study materials. Build your future with verified resources.
                            </p>
                            <div className="flex gap-4">
                                {[
                                    { name: "Instagram", href: "https://www.instagram.com/all_government_alerts/", icon: <Instagram className="h-5 w-5" /> },
                                    { name: "YouTube", href: "https://youtube.com/@all_government_alerts", icon: <Youtube className="h-5 w-5" /> },
                                    { name: "WhatsApp", href: "https://whatsapp.com/channel/0029VanToDy3gvWdW6pOsQ3J", icon: <FaWhatsapp className="h-5 w-5" /> },
                                    { name: "Telegram", href: "https://t.me/all_government_alerts", icon: <Send className="h-5 w-5" /> },
                                ].map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 w-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors"
                                        title={social.name}
                                    >
                                        {social.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 className="text-text-primary font-semibold text-sm mb-4">Platform</h5>
                            <div className="flex flex-col gap-3 text-text-muted text-sm">
                                <Link href="#exams" className="hover:text-accent transition-colors">Browse Materials</Link>
                                <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
                                <Link href="#pricing" className="hover:text-accent transition-colors">Pricing Plans</Link>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-text-primary font-semibold text-sm mb-4">Legal</h5>
                            <div className="flex flex-col gap-3 text-text-muted text-sm">
                                <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                                <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                                <Link href="/license" className="hover:text-accent transition-colors">License Agreement</Link>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-text-muted">
                            © {new Date().getFullYear()} All Government Alerts. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm text-text-muted">All systems operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
