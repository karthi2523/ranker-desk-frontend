import { AdminSidebar } from "@/components/layout/AdminSidebar"


interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-red-500/30">
            <AdminSidebar />
            <div className="flex flex-1 flex-col">
                {/* We can create a specific AdminTopbar if needed, for now reusing common patterns or just header */}
                <header className="flex h-16 items-center border-b border-red-900/20 bg-slate-950/50 px-6 backdrop-blur-xl">
                    <div className="ml-auto flex items-center gap-4">
                        <div className="text-sm text-slate-400">Admin Mode</div>
                        <div className="h-8 w-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-xs font-medium text-red-400">
                            AD
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
