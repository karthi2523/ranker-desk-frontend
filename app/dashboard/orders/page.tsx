import { OrderTable } from"@/components/features/OrderTable"
import { Download, Filter } from"lucide-react"
import { Button } from"@/components/ui/button"

export default function OrdersPage() {
 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-bold text-text-primary">Order History</h2>
 <p className="text-text-secondary">View and manage your purchase history.</p>
 </div>
 <div className="flex gap-2">
 <Button variant="outline"size="sm"className="gap-2">
 <Filter className="h-4 w-4"/>
 Filter
 </Button>
 <Button variant="outline"size="sm"className="gap-2">
 <Download className="h-4 w-4"/>
 Export
 </Button>
 </div>
 </div>
 <OrderTable />
 </div>
 )
}
