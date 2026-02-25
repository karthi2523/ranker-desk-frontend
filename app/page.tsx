import { LandingNavbar } from "@/components/layout/LandingNavbar"
import { Button } from "@/components/ui/button"
import {
  Shield, Lock, Zap, BookOpen, Award,
  FileText, Star, Users, Target, ArrowRight, ChevronRight,
  Twitter, Youtube, Instagram, Send
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const categories = [
    { name: "UPSC / Civil Services", icon: <Award className="h-5 w-5" />, count: "1,200+ Materials" },
    { name: "SSC / CGL / CHSL", icon: <Target className="h-5 w-5" />, count: "2,500+ Materials" },
    { name: "Banking / IBPS / SBI", icon: <Lock className="h-5 w-5" />, count: "1,800+ Materials" },
    { name: "Railways / RRB", icon: <Zap className="h-5 w-5" />, count: "950+ Materials" },
    { name: "Defense / Army / Navy", icon: <Shield className="h-5 w-5" />, count: "600+ Materials" },
    { name: "State Govt Exams", icon: <BookOpen className="h-5 w-5" />, count: "3,200+ Materials" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#f0f2f5]">
      <LandingNavbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-28 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111827] border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold mb-8 tracking-wide">
            <Star className="h-3.5 w-3.5 fill-[#c9a84c]" />
            #1 Trusted Platform for Govt Exam Aspirants
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05] text-[#f0f2f5]">
            Master Your Exams,
            <br />
            <span className="text-[#c9a84c]">Secure Your Future.</span>
          </h1>

          <p className="text-base lg:text-lg text-[#8a9bb0] max-w-2xl mx-auto mb-10 leading-relaxed">
            Access premium, verified, and watermarked study materials for Indian Government Exams.
            All Gov Alerts provides the edge you need to crack UPSC, SSC, Banking, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8 h-12 text-base rounded-xl">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base rounded-xl">
                Login to Your Vault
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-10 border-t border-[#1e2d45]">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "10K+", label: "Study Materials" },
              { value: "98%", label: "Success Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[#f0f2f5] mb-1">{stat.value}</div>
                <div className="text-xs text-[#4a5a70] uppercase tracking-widest font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam Categories ────────────────────────────────────── */}
      <section id="exams" className="py-20 border-t border-[#1e2d45]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest mb-3">Explore Categories</p>
              <h2 className="text-3xl font-bold text-[#f0f2f5]">Find Your Stream</h2>
              <p className="text-[#8a9bb0] mt-3">Comprehensive materials tailored for every major government recruitment board in India.</p>
            </div>
            <Link href="/register" className="text-[#c9a84c] hover:text-[#dbb95c] font-semibold flex items-center gap-2 group text-sm">
              Browse All <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="group p-5 rounded-xl bg-[#111827] border border-[#1e2d45] hover:border-[#c9a84c]/30 transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mb-4 text-[#c9a84c]">
                  {cat.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#f0f2f5] mb-1">{cat.name}</h3>
                <p className="text-[#4a5a70] text-xs mb-4">{cat.count}</p>
                <Link href="/register">
                  <span className="text-xs font-semibold text-[#c9a84c] hover:text-[#dbb95c] flex items-center gap-1 transition-colors">
                    View Details <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="py-20 border-t border-[#1e2d45]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3 text-[#f0f2f5]">Why Choose All Gov Alerts?</h2>
            <p className="text-[#8a9bb0] max-w-xl mx-auto">Premium content with state-of-the-art security to ensure your study journey is uninterrupted.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Shield className="h-7 w-7 text-[#c9a84c]" />,
                title: "Dynamic Watermarking",
                desc: "Your content is uniquely assigned to you with real-time watermarking to prevent unauthorized sharing.",
              },
              {
                icon: <FileText className="h-7 w-7 text-[#c9a84c]" />,
                title: "Verified Publications",
                desc: "Only content from top-tier publishers and retired bureaucrats. No junk, just high-yield study notes.",
              },
              {
                icon: <Zap className="h-7 w-7 text-[#c9a84c]" />,
                title: "Latest Govt Notifications",
                desc: "Instant alerts for new vacancies, admit cards, and results. Stay one step ahead of official portals.",
              },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center group">
                <div className="h-14 w-14 rounded-xl bg-[#111827] border border-[#1e2d45] group-hover:border-[#c9a84c]/30 flex items-center justify-center mb-5 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-[#f0f2f5]">{f.title}</h3>
                <p className="text-[#8a9bb0] leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 border-t border-[#1e2d45]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest mb-3">Transparent Pricing</p>
            <h2 className="text-3xl font-bold text-[#f0f2f5]">Pay Only for What You Need</h2>
            <p className="text-[#8a9bb0] mt-3 max-w-xl mx-auto">No monthly subscriptions. Purchase specific materials at affordable, transparent rates.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Highlight card */}
            <div className="lg:col-span-1 p-8 rounded-xl bg-[#c9a84c] flex flex-col justify-center">
              <div className="text-[#0a0e1a]/70 font-bold mb-3 uppercase tracking-widest text-xs">Price Range</div>
              <div className="text-5xl font-black text-[#0a0e1a] mb-2">₹50<span className="text-2xl font-normal opacity-50 mx-2">-</span>₹1000</div>
              <p className="text-[#0a0e1a]/70 text-sm leading-relaxed">Highly competitive pricing based on depth of material and exam complexity.</p>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {[
                { name: "Daily Alerts & Updates", price: "From ₹50", desc: "Instant notifications and summary notes." },
                { name: "SSC / Bank Capsules", price: "₹150–₹350", desc: "Topic-wise verified study modules." },
                { name: "UPSC Standard Notes", price: "₹500–₹850", desc: "In-depth analysis from retired officers." },
                { name: "Full Exam Bundles", price: "Max ₹1000", desc: "Complete repository for a specific recruitment board." },
              ].map((item) => (
                <div key={item.name} className="p-5 rounded-xl bg-[#111827] border border-[#1e2d45] hover:border-[#c9a84c]/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-bold text-[#f0f2f5]">{item.name}</h4>
                      <span className="text-[#c9a84c] font-bold text-xs bg-[#c9a84c]/10 px-2 py-0.5 rounded-full shrink-0 ml-2">{item.price}</span>
                    </div>
                    <p className="text-[#4a5a70] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                  <Link href="/register" className="mt-5 text-xs font-semibold text-[#c9a84c] hover:text-[#dbb95c] flex items-center gap-1 transition-colors">
                    Explore <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 p-5 rounded-xl border border-dashed border-[#1e2d45] text-center max-w-2xl mx-auto">
            <p className="text-[#8a9bb0] text-sm flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-[#c9a84c]" />
              All purchases come with lifetime access and dynamic watermarking protection.
            </p>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────── */}
      <section id="about" className="py-20 border-t border-[#1e2d45]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest mb-3">About Us</p>
            <h2 className="text-3xl font-bold text-[#f0f2f5] mb-5">Empowering Indian Aspirants Since 2024</h2>
            <p className="text-[#8a9bb0] leading-relaxed mb-7 text-sm">
              All Government Alerts started with a simple mission: make premium study materials accessible and secure for students across India.
              Every student deserves a fair chance at cracking government exams without worrying about data safety or overpriced coaching.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#f0f2f5] font-bold mb-1.5 text-sm">
                  <Users className="h-4 w-4 text-[#c9a84c]" /> Our Community
                </div>
                <p className="text-xs text-[#4a5a70]">Over 50,000 students rely on us daily for exam preparation.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#f0f2f5] font-bold mb-1.5 text-sm">
                  <Target className="h-4 w-4 text-[#c9a84c]" /> Our Goal
                </div>
                <p className="text-xs text-[#4a5a70]">Helping 1 million aspirants achieve their dream government job by 2030.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-sm aspect-square bg-[#111827] rounded-2xl border border-[#1e2d45] flex items-center justify-center">
            <Shield className="h-24 w-24 text-[#c9a84c]/60" />
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#1e2d45]">
        <div className="container mx-auto px-6">
          <div className="rounded-2xl border border-[#c9a84c]/20 bg-[#111827] p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-[#f0f2f5] mb-5">Ready to Crack Your Goal?</h2>
            <p className="text-[#8a9bb0] text-base max-w-xl mx-auto mb-10">
              Join thousands of students who have already started their journey with All Gov Alerts. Get instant access now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="px-10 h-12 text-base rounded-xl">Register for Free</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-10 h-12 text-base rounded-xl">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-14 border-t border-[#1e2d45] bg-[#0a0e1a]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg overflow-hidden border border-[#1e2d45]">
                  <img src="/logo.png" alt="All Government Alerts" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-[#f0f2f5] tracking-tight leading-none">All Government</span>
                  <span className="text-[9px] font-bold text-[#c9a84c] tracking-[0.3em] uppercase mt-1">Alerts Platform</span>
                </div>
              </Link>
              <p className="text-[#8a9bb0] text-sm max-w-sm leading-relaxed mb-6">
                India&apos;s most secure and comprehensive platform for government exam study materials.
              </p>
              <div className="flex gap-3">
                {[
                  { name: "Twitter", icon: <Twitter className="h-4 w-4" /> },
                  { name: "Telegram", icon: <Send className="h-4 w-4" /> },
                  { name: "YouTube", icon: <Youtube className="h-4 w-4" /> },
                  { name: "Instagram", icon: <Instagram className="h-4 w-4" /> },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href="#"
                    className="h-9 w-9 rounded-lg bg-[#111827] border border-[#1e2d45] flex items-center justify-center text-[#4a5a70] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-[#f0f2f5] font-bold text-xs uppercase tracking-widest mb-6">Platform</h5>
              <div className="flex flex-col gap-4 text-[#8a9bb0] text-sm">
                {["Browse Exams", "Features", "Pricing"].map((item) => (
                  <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5 group">
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-[#f0f2f5] font-bold text-xs uppercase tracking-widest mb-6">Legal</h5>
              <div className="flex flex-col gap-4 text-[#8a9bb0] text-sm">
                {["Privacy Policy", "Terms of Service", "Safe PDF License"].map((item) => (
                  <Link key={item} href="/login" className="hover:text-[#c9a84c] transition-colors flex items-center gap-1.5 group">
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1e2d45] flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-xs text-[#4a5a70] font-medium">
              © 2026 All Government Alerts. All rights reserved.
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111827] border border-[#1e2d45]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
              <span className="text-[10px] font-semibold text-[#4a5a70] uppercase tracking-widest">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
