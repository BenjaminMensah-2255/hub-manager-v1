import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import Staff from "@/models/Staff"
import Claim from "@/models/Claim"
import { Users, CreditCard, CalendarOff, AlertTriangle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const session = await auth()
    if (session?.user?.role !== 'Admin') {
        return <div className="p-8 text-destructive font-bold">Access Denied: Admin Role Required</div>
    }

    await dbConnect()

    // Analytics
    const staffOnLeave = await Staff.countDocuments({ status: { $in: ['On Leave', 'Out of Office'] } })
    const totalStaff = await Staff.countDocuments({})

    // Total monthly approved claims
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const approvedClaims = await Claim.aggregate([
        {
            $match: {
                status: 'Approved',
                updatedAt: { $gte: startOfMonth }
            }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    const totalApproved = approvedClaims[0]?.total || 0

    const pendingClaimsCount = await Claim.countDocuments({ status: 'Pending' })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Real-time overview of Hub operations.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Cards */}
                <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Staff On Leave / OOO</div>
                        <CalendarOff className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold">{staffOnLeave} / {totalStaff}</div>
                </div>

                <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Approved Claims (Month)</div>
                        <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">${totalApproved.toFixed(2)}</div>
                </div>

                <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Pending Claims</div>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">{pendingClaimsCount}</div>
                </div>

                <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between pb-2">
                        <div className="text-sm font-medium text-muted-foreground">Active Users</div>
                        <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{totalStaff}</div>
                </div>
            </div>
        </div>
    )
}
