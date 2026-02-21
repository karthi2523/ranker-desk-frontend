import { LandingNavbar } from "@/components/layout/LandingNavbar"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Lock,
  Zap,
  CheckCircle,
  BookOpen,
  Search,
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
} from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Rich Background Layer */}
        <div className="absolute inset-0 -z-10">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Mesh Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] max-w-6xl">
            <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse opacity-50" />
            <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[100px] animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[80px] animate-pulse opacity-40" style={{ animationDelay: '4s' }} />
          </div>
        </div>

        <div className="container mx-auto px-6 text-center relative">
          {/* Decorative Floating Elements */}
          <div className="absolute -top-10 -left-10 h-32 w-32 bg-indigo-500/10 rounded-3xl rotate-12 blur-2xl animate-bounce" style={{ animationDuration: '6s' }} />
          <div className="absolute top-20 -right-20 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8 backdrop-blur-md shadow-xl shadow-indigo-500/10">
            <Star className="h-4 w-4 fill-indigo-400" />
            <span>#1 Trusted Platform for Govt Exam ASPIRANTS</span>
          </div>

          <h1 className="text-5xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
            <span className="bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
              Master Your Exams,
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic pb-2">
              Secure Your Future.
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Access premium, verified, and watermarked study materials for Indian Government Exams.
            All Gov Alerts provides the edge you need to crack UPSC, SSC, Banking, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-16 text-xl font-bold rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105 group active:scale-95">
                Start Your Journey
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-800 text-slate-200 px-10 h-16 text-xl font-semibold rounded-2xl transition-all active:scale-95">
                Login to Your Vault
              </Button>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/5">
            <div>
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Study Materials</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories Section */}
      <section id="exams" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">Explore Categories</h2>
              <h3 className="text-4xl font-bold text-white">Find Your Stream</h3>
              <p className="text-slate-400 mt-4 h-12">Comprehensive materials tailored for every major government recruitment board in India.</p>
            </div>
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 group">
              Browse All Categories <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="group p-8 rounded-3xl bg-slate-900/30 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <div className="text-indigo-500">{cat.icon}</div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{cat.name}</h4>
                <p className="text-slate-500 font-medium mb-4">{cat.count}</p>
                <Link href="/register">
                  <Button variant="ghost" className="p-0 h-auto text-indigo-400 hover:text-indigo-300 hover:bg-transparent -ml-1">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-indigo-600/5 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose All Gov Alerts?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We combine premium content with state-of-the-art security to ensure your study journey is uninterrupted and successful.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="h-16 w-16 mx-auto rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-indigo-500 transition-colors">
                <Shield className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Dynamic Watermarking</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Your content is uniquely assigned to you with real-time watermarking to prevent unauthorized sharing and protect your license.
              </p>
            </div>

            <div className="text-center group">
              <div className="h-16 w-16 mx-auto rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-indigo-500 transition-colors">
                <FileText className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Verified Publications</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                We only host content from top-tier publishers and retired bureaucrats. No junk, just high-yield study notes.
              </p>
            </div>

            <div className="text-center group">
              <div className="h-16 w-16 mx-auto rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-indigo-500 transition-colors">
                <Zap className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Latest Govt Notifications</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Get instant alerts for new vacancies, admit cards, and results. Stay one step ahead of the official portals.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">Transparent Pricing</h2>
            <h3 className="text-4xl font-bold text-white">Pay Only for What You Need</h3>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto font-medium">No monthly subscriptions. Purchase specific study materials and exam notes at affordable rates tailored to each competitive field.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Price Range Info */}
            <div className="lg:col-span-1 p-10 rounded-[2.5rem] bg-indigo-600 flex flex-col justify-center relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-[-20deg] translate-x-1/2" />
              <div className="relative z-10">
                <div className="text-indigo-100 font-bold mb-4 uppercase tracking-widest text-xs">Price Range</div>
                <div className="text-6xl font-black text-white mb-2 italic">₹50<span className="text-3xl font-normal opacity-60 mx-2">-</span>₹1000</div>
                <p className="text-indigo-100/80 font-medium leading-relaxed">
                  Highly competitive pricing based on the depth of material and exam complexity.
                </p>
              </div>
            </div>

            {/* Exam Price Highlights */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {[
                { name: "Daily Alerts & Updates", price: "Starting ₹50", desc: "Instant notifications and summary notes." },
                { name: "SSC / Bank Capsules", price: "₹150 - ₹350", desc: "Topic-wise verified study modules." },
                { name: "UPSC Standard Notes", price: "₹500 - ₹850", desc: "In-depth analysis from retired officers." },
                { name: "Full Exam Bundles", price: "Max ₹1000", desc: "Complete repository for a specific recruitment boatd." },
              ].map((item) => (
                <div key={item.name} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{item.name}</h4>
                      <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-3 py-1 rounded-full">{item.price}</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                  <Link href="/register" className="mt-6">
                    <Button variant="ghost" className="p-0 h-auto text-indigo-400 group-hover:text-indigo-300">
                      Explore Materials <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-slate-900/20 border border-dashed border-slate-800 text-center">
            <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-indigo-500" />
              All purchases come with lifetime access to the specific version and dynamic watermarking protection.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-slate-900/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">About Us</h2>
            <h3 className="text-4xl font-bold text-white mb-6">Empowering Indian Aspirants Since 2024</h3>
            <p className="text-slate-400 leading-relaxed mb-6 font-medium">
              All Government Alerts started with a simple mission: to make premium study materials accessible and secure for students across India. We believe that every student deserves a fair chance at cracking government exams without worrying about data safety or overpriced coaching.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 text-white font-bold mb-2">
                  <Users className="h-5 w-5 text-indigo-500" /> Our Community
                </div>
                <p className="text-sm text-slate-500 font-medium">Over 50,000 students rely on us daily for their exam preparation journey.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white font-bold mb-2">
                  <Target className="h-5 w-5 text-indigo-500" /> Our Goal
                </div>
                <p className="text-sm text-slate-500 font-medium">Helping at least 1 million aspirants achieve their dream government job by 2030.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg aspect-square bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[3rem] border border-white/5 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-indigo-600/10 blur-[60px] rounded-full" />
            <Shield className="h-32 w-32 text-indigo-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="relative rounded-[3rem] overflow-hidden bg-indigo-600 p-12 md:p-20 text-center">
            {/* Background design for CTA */}
            <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-[-20deg] translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Crack Your Goal?</h2>
              <p className="text-indigo-100/80 text-xl max-w-2xl mx-auto mb-10 font-medium">
                Join thousands of students who have already started their journey with All Gov Alerts. Get instant access now.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 h-14 text-lg font-bold rounded-2xl shadow-xl shadow-black/20 transition-all hover:scale-105">
                    Register for Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" className="bg-indigo-700/50 hover:bg-indigo-700/80 text-white border border-indigo-400/30 px-10 h-14 text-lg font-bold rounded-2xl transition-all">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/5 bg-slate-950 overflow-hidden">
        {/* Footer Background Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] max-w-4xl -z-10">
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="group flex items-center gap-5 mb-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-60 transition-opacity" />
                  <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                    <img
                      src="/logo.png"
                      alt="All Government Alerts Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white tracking-tighter uppercase group-hover:text-indigo-400 transition-colors leading-[0.9]">
                    All Government
                  </span>
                  <span className="text-[12px] font-black text-indigo-500 tracking-[0.4em] uppercase mt-2 opacity-80">
                    Alerts Platform
                  </span>
                </div>
              </Link>
              <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-8">
                India&apos;s most secure and comprehensive platform for government exam study materials. Empowering millions of aspirants to secure their future with verified notifications and premium content.
              </p>
              <div className="flex gap-5">
                {[
                  { name: "Twitter", icon: <Twitter className="h-4 w-4" /> },
                  { name: "Telegram", icon: <Send className="h-4 w-4" /> },
                  { name: "YouTube", icon: <Youtube className="h-4 w-4" /> },
                  { name: "Instagram", icon: <Instagram className="h-4 w-4" /> },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href="#"
                    className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all duration-300 group"
                  >
                    <div className="group-hover:scale-110 transition-transform">{social.icon}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Platform</h5>
              <div className="flex flex-col gap-5 text-slate-400 font-bold text-sm">
                <Link href="#exams" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  Browse Exams
                </Link>
                <Link href="#features" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  Features
                </Link>
                <Link href="#pricing" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  Pricing
                </Link>
              </div>
            </div>

            <div>
              <h5 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Legal & Trust</h5>
              <div className="flex flex-col gap-5 text-slate-400 font-bold text-sm">
                <Link href="/login" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  Privacy Policy
                </Link>
                <Link href="/login" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  Terms of Service
                </Link>
                <Link href="/login" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  Safe PDF License
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-sm text-slate-500 font-bold tracking-tight">
              © 2026 ALL GOVERNMENT ALERTS. PROTECTING ASPIRANTS&apos; FUTURE.
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Systems Operational</span>
            </div>
          </div>
        </div >
      </footer >
    </div >
  )
}
