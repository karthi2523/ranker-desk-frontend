import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, FileText, TrendingUp, ShoppingCart } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Admin Overview</h2>
                <p className="text-slate-400">Platform performance and statistics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-red-900/20 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">$12,450.00</div>
                        <p className="text-xs text-slate-400">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-red-900/20 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">+2350</div>
                        <p className="text-xs text-slate-400">+180 new this week</p>
                    </CardContent>
                </Card>
                <Card className="border-red-900/20 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Total Materials</CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">42</div>
                        <p className="text-xs text-slate-400">12 uploaded this month</p>
                    </CardContent>
                </Card>
                <Card className="border-red-900/20 bg-slate-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Active Sessions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">573</div>
                        <p className="text-xs text-slate-400">Currently online</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-red-900/20 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <ShoppingCart className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Advanced Quantum Physics</p>
                                            <p className="text-xs text-slate-400">Purchased by user@example.com</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-emerald-500">+$49.99</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
