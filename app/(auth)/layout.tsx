export default function AuthLayout({ children }: { children: React.ReactNode }) {
 return (
 <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full -z-10"/>
 <div className="w-full max-w-md space-y-8">
 {children}
 </div>
 </div>
 )
}
