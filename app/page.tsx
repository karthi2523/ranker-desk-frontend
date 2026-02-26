import { LandingNavbar } from"@/components/layout/LandingNavbar"
import { Button } from"@/components/ui/button"
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
 Twitter,
 Youtube,
 Instagram,
 Send
} from"lucide-react"
import Link from"next/link"

export default function Home() {
 const categories = [
 { name:"UPSC / Civil Services", icon: <Award className="h-6 w-6"/>, count:"1,200+ Materials"},
 { name:"SSC / CGL / CHSL", icon: <Target className="h-6 w-6"/>, count:"2,500+ Materials"},
 { name:"Banking / IBPS / SBI", icon: <Lock className="h-6 w-6"/>, count:"1,800+ Materials"},
 { name:"Railways / RRB", icon: <Zap className="h-6 w-6"/>, count:"950+ Materials"},
 { name:"Defense / Army / Navy", icon: <Shield className="h-6 w-6"/>, count:"600+ Materials"},
 { name:"State Govt Exams", icon: <BookOpen className="h-6 w-6"/>, count:"3,200+ Materials"},
 ]

 return (
 <div className="min-h-screen bg-background text-text-primary selection:bg-surface-raised">
 <LandingNavbar />

 {/* Hero Section */}
 <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-24 overflow-hidden border-b border-border">
 <div className="container mx-auto px-6 text-center relative z-10">
 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-background text-xs font-black tracking-widest uppercase mb-12 shadow-sm">
 <Star className="h-3 w-3 fill-black"/>
 <span>#1 Trusted Platform for Govt Aspirants</span>
 </div>

 <h1 className="text-5xl lg:text-8xl xl:text-[9rem] font-black tracking-tighter mb-8 leading-[0.85]">
 <span className="text-text-primary">
 Master Exams.
 </span>
 <br />
 <span className="text-text-muted italic">
 Secure Future.
 </span>
 </h1>

 <p className="text-xl lg:text-2xl text-text-muted max-w-3xl mx-auto mb-16 leading-relaxed font-medium tracking-tight">
 Access premium, verified, and watermarked study materials for Indian Government Exams.
 We provide the exact edge you need.
 </p>

 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
 <Link href="/register">
 <Button size="lg"className="bg-white hover:bg-accent-hover text-background px-12 h-16 text-xl font-black tracking-tight rounded-xl transition-all hover:scale-105 active:scale-95 group">
 Begin Identity Verification
 <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1"/>
 </Button>
 </Link>
 <Link href="/login">
 <Button size="lg"variant="outline"className="border-border bg-background hover:bg-surface text-text-secondary px-12 h-16 text-xl font-black tracking-tight rounded-xl transition-all active:scale-95">
 Access Vault
 </Button>
 </Link>
 </div>

 {/* Social Proof Stats */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-12 border-t border-border">
 <div>
 <div className="text-4xl font-black text-text-primary mb-2 tracking-tighter">50K+</div>
 <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black">Active Entities</div>
 </div>
 <div>
 <div className="text-4xl font-black text-text-primary mb-2 tracking-tighter">10K+</div>
 <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black">Secure Archives</div>
 </div>
 <div>
 <div className="text-4xl font-black text-text-primary mb-2 tracking-tighter">98%</div>
 <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black">Clearance Rate</div>
 </div>
 <div>
 <div className="text-4xl font-black text-text-primary mb-2 tracking-tighter">24/7</div>
 <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black">Overwatch</div>
 </div>
 </div>
 </div>
 </section>

 {/* Exam Categories Section */}
 <section id="exams"className="py-24 relative overflow-hidden bg-background">
 <div className="container mx-auto px-6">
 <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
 <div className="max-w-2xl">
 <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Database Sectors</h2>
 <h3 className="text-5xl font-black text-text-primary tracking-tight">Select Classification</h3>
 <p className="text-text-muted mt-6 leading-relaxed text-lg font-medium">Enterprise-grade materials tailored for every major government recruitment board in India.</p>
 </div>
 <Link href="/register"className="text-text-primary hover:text-text-secondary font-black tracking-tight flex items-center gap-2 group transition-colors">
 Access Full Index <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
 </Link>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {categories.map((cat) => (
 <div key={cat.name} className="group p-8 bg-background border border-border hover:border-border transition-all duration-300">
 <div className="h-12 w-12 bg-surface flex items-center justify-center mb-8 border border-border">
 <div className="text-background">{cat.icon}</div>
 </div>
 <h4 className="text-2xl font-black text-text-primary tracking-tight mb-2">{cat.name}</h4>
 <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-6">{cat.count}</p>
 <Link href="/register">
 <Button variant="ghost"className="p-0 h-auto text-text-secondary group-hover:text-text-primary hover:bg-transparent -ml-1 transition-colors font-bold tracking-tight">
 Decrypt Detail <ArrowRight className="ml-2 h-4 w-4"/>
 </Button>
 </Link>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Features Section */}
 <section id="features"className="py-24 bg-background border-y border-border">
 <div className="container mx-auto px-6">
 <div className="text-center mb-20">
 <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-text-primary">Why Choose All Gov?</h2>
 <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium leading-relaxed">We combine premium content with state-of-the-art security to ensure your study journey is uninterrupted and successful.</p>
 </div>

 <div className="grid md:grid-cols-3 gap-12">
 <div className="text-left group border-t-2 border-border pt-8 hover:border-white transition-colors">
 <div className="h-12 w-12 bg-surface flex items-center justify-center mb-8 border border-border">
 <Shield className="h-6 w-6 text-background"/>
 </div>
 <h3 className="text-2xl font-black tracking-tight mb-4 text-text-primary">Cryptographic Watermark</h3>
 <p className="text-text-muted leading-relaxed font-medium">
 Your content is uniquely assigned to you with real-time watermarking to prevent unauthorized sharing and protect your license.
 </p>
 </div>

 <div className="text-left group border-t-2 border-border pt-8 hover:border-white transition-colors">
 <div className="h-12 w-12 bg-surface flex items-center justify-center mb-8 border border-border">
 <FileText className="h-6 w-6 text-background"/>
 </div>
 <h3 className="text-2xl font-black tracking-tight mb-4 text-text-primary">Verified Publications</h3>
 <p className="text-text-muted leading-relaxed font-medium">
 We only host content from top-tier publishers and retired bureaucrats. No junk, just high-yield study notes.
 </p>
 </div>

 <div className="text-left group border-t-2 border-border pt-8 hover:border-white transition-colors">
 <div className="h-12 w-12 bg-surface flex items-center justify-center mb-8 border border-border">
 <Zap className="h-6 w-6 text-background"/>
 </div>
 <h3 className="text-2xl font-black tracking-tight mb-4 text-text-primary">Zero-Day Intel</h3>
 <p className="text-text-muted leading-relaxed font-medium">
 Get instant alerts for new vacancies, admit cards, and results. Stay one step ahead of the official portals.
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* Pricing Section */}
 <section id="pricing"className="py-24 bg-background relative overflow-hidden">
 <div className="container mx-auto px-6">
 <div className="text-center mb-20">
 <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Acquisition Parameters</h2>
 <h3 className="text-5xl font-black text-text-primary tracking-tight">Per-Asset Pricing Model</h3>
 <p className="text-text-muted mt-6 max-w-2xl mx-auto font-medium text-lg leading-relaxed">No subscriptions. Purchase highly specific intel modules and exam notes on a per-asset basis.</p>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 max-w-6xl mx-auto border border-border bg-background">
 {/* Price Range Info */}
 <div className="lg:col-span-1 p-12 bg-white flex flex-col justify-center border-r border-border">
 <div className="text-background font-black mb-6 uppercase tracking-widest text-[10px]">Financial Scale</div>
 <div className="text-6xl font-black text-background mb-4 tracking-tighter">₹50<span className="text-3xl font-normal text-text-secondary mx-2">-</span>₹1k</div>
 <p className="text-text-muted font-bold leading-relaxed tracking-tight">
 Calibrated pricing mapped precisely to intel density and sector complexity.
 </p>
 </div>

 {/* Exam Price Highlights */}
 <div className="lg:col-span-2 grid sm:grid-cols-2">
 {[
 { name:"Daily Alerts & Updates", price:"Starts at ₹50", desc:"Instant notifications and summary briefs."},
 { name:"SSC / Bank Capsules", price:"₹150 - ₹350", desc:"Targeted verification modules."},
 { name:"UPSC Core Intel", price:"₹500 - ₹850", desc:"In-depth strategic analysis from veterans."},
 { name:"Master Architecture", price:"Ceiling ₹1000", desc:"Complete repository access per domain."},
 ].map((item, i) => (
 <div key={item.name} className={`p-10 hover:bg-background transition-colors flex flex-col justify-between group ${i % 2 === 0 ? 'border-r border-border' : ''} ${i < 2 ? 'border-b border-border' : ''}`}>
 <div>
 <div className="flex justify-between items-start mb-6">
 <h4 className="text-xl font-black tracking-tight text-text-primary group-hover:text-text-secondary transition-colors">{item.name}</h4>
 </div>
 <div className="text-text-primary font-black text-sm px-4 py-2 border border-border bg-surface inline-block mb-4 tracking-tight">{item.price}</div>
 <p className="text-text-muted text-sm font-medium leading-relaxed">{item.desc}</p>
 </div>
 <Link href="/register"className="mt-8 block">
 <Button variant="ghost"className="p-0 h-auto text-text-primary group-hover:pl-2 transition-all font-black tracking-tight rounded-none">
 Acquire Asset <ArrowRight className="ml-2 h-4 w-4"/>
 </Button>
 </Link>
 </div>
 ))}
 </div>
 </div>

 <div className="mt-16 py-6 border-y border-border text-center max-w-6xl mx-auto">
 <p className="text-text-muted font-bold tracking-tight text-sm flex items-center justify-center gap-3">
 <Zap className="h-4 w-4 text-text-primary"/>
 LIFETIME RETENTION ON ALL SECURED INTEL • CRYPTOGRAPHIC WATERMARKING ACTIVE
 </p>
 </div>
 </div>
 </section>

 {/* About Section */}
 <section id="about"className="py-24 bg-background border-y border-border">
 <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
 <div className="flex-1">
 <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Origins</h2>
 <h3 className="text-4xl md:text-5xl font-black text-text-primary mb-8 tracking-tight">Architecting the Standard Since 2024</h3>
 <p className="text-text-secondary leading-relaxed mb-10 font-medium text-lg">
 All Gov started with a strict directive: centralize, secure, and distribute premium prep intel. We eradicated data leaks and eliminated hyper-inflated academy fees.
 </p>
 <div className="grid grid-cols-2 gap-12 border-t border-border pt-8">
 <div>
 <div className="text-4xl font-black text-text-primary tracking-tighter mb-2">50K<span className="text-text-muted">+</span></div>
 <p className="text-[10px] text-text-muted font-black tracking-widest uppercase">Verified Active Units</p>
 </div>
 <div>
 <div className="text-4xl font-black text-text-primary tracking-tighter mb-2">1M<span className="text-text-muted">/30</span></div>
 <p className="text-[10px] text-text-muted font-black tracking-widest uppercase">Target Clearances</p>
 </div>
 </div>
 </div>
 <div className="flex-1 w-full max-w-lg aspect-square bg-background border border-border flex items-center justify-center relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzI3MjcyYSIvPjwvc3ZnPg==')]">
 <Shield className="h-32 w-32 text-text-primary"/>
 </div>
 </div>
 </section>

 {/* Final CTA */}
 <section className="py-24 bg-background">
 <div className="container mx-auto px-6">
 <div className="border border-border bg-background p-12 md:p-24 text-center relative overflow-hidden group">
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"/>

 <div className="relative z-10">
 <h2 className="text-4xl md:text-7xl font-black text-text-primary mb-8 tracking-tighter">Initiate Protocol.</h2>
 <p className="text-text-muted text-xl max-w-2xl mx-auto mb-12 font-medium tracking-tight">
 Secure your clearance now. The database is primed.
 </p>
 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
 <Link href="/register">
 <Button size="lg"className="bg-white text-background hover:bg-accent-hover px-12 h-16 text-lg font-black tracking-tight rounded-none transition-all active:scale-95">
 Execute Registration
 </Button>
 </Link>
 <Link href="/login">
 <Button size="lg"variant="outline"className="bg-background text-text-primary border-border hover:bg-surface px-12 h-16 text-lg font-black tracking-tight rounded-none transition-all">
 Login Clearance
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Footer */}
 <footer className="py-20 border-t border-border bg-background">
 <div className="container mx-auto px-6">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
 <div className="col-span-1 md:col-span-2">
 <Link href="/"className="group flex items-center gap-5 mb-10">
 <div className="h-16 w-16 border border-border bg-background flex items-center justify-center group-hover:border-slate-500 transition-colors">
 <img
 src="/logo.png"
 alt="Logo"
 className="h-8 w-8 object-contain grayscale opacity-80 group-hover:opacity-100"
 />
 </div>
 <div className="flex flex-col">
 <span className="text-3xl font-black text-text-primary tracking-tighter uppercase transition-colors leading-[0.9]">
 All Gov
 </span>
 <span className="text-[12px] font-black text-text-muted tracking-[0.4em] uppercase mt-2">
 Platform
 </span>
 </div>
 </Link>
 <p className="text-text-muted font-bold max-w-sm leading-relaxed mb-8 tracking-tight">
 India's strict-access platform for government exam study materials. High security. No noise.
 </p>
 <div className="flex gap-4">
 {[
 { name:"Twitter", icon: <Twitter className="h-5 w-5"/> },
 { name:"Telegram", icon: <Send className="h-5 w-5"/> },
 { name:"YouTube", icon: <Youtube className="h-5 w-5"/> },
 ].map((social) => (
 <Link
 key={social.name}
 href="#"
 className="h-12 w-12 bg-background border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white transition-all duration-300"
 >
 {social.icon}
 </Link>
 ))}
 </div>
 </div>

 <div>
 <h5 className="text-text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8">Directories</h5>
 <div className="flex flex-col gap-5 text-text-muted font-bold text-sm tracking-tight">
 <Link href="#exams"className="hover:text-text-primary transition-colors">Browse Index</Link>
 <Link href="#features"className="hover:text-text-primary transition-colors">Spec Sheet</Link>
 <Link href="#pricing"className="hover:text-text-primary transition-colors">Financials</Link>
 </div>
 </div>

 <div>
 <h5 className="text-text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8">Protocol Validations</h5>
 <div className="flex flex-col gap-5 text-text-muted font-bold text-sm tracking-tight">
 <Link href="/login"className="hover:text-text-primary transition-colors">Data Privacy</Link>
 <Link href="/login"className="hover:text-text-primary transition-colors">Terms of Service</Link>
 <Link href="/login"className="hover:text-text-primary transition-colors">License Agreement</Link>
 </div>
 </div>
 </div>

 <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
 <div className="text-[10px] text-text-muted font-black tracking-[0.2em] uppercase">
 © 2026 ALL GOV. STRICT ARCHITECTURE.
 </div>
 <div className="flex items-center gap-3 px-4 py-2 border border-border bg-background">
 <div className="h-1.5 w-1.5 rounded-full bg-white"/>
 <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Op Normal</span>
 </div>
 </div>
 </div>
 </footer>
 </div>
 )
}
