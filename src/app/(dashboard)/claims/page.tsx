import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import Claim from "@/models/Claim"
import { ClaimList } from "@/components/claims/claim-list"
import { ClaimSubmissionDialog } from "@/components/claims/claim-form"

// Force dynamic rendering to ensure real-time data
export const dynamic = 'force-dynamic'

export default async function ClaimsPage() {
    const session = await auth()
    if (!session?.user) return <div>Unauthorized</div>

    await dbConnect()

    let query = {}
    // Staff only see their own. Supervisors/Admin see all.
    if (session.user.role === 'Staff') {
        query = { staffId: session.user.id }
    }

    const claimsDocs = await Claim.find(query)
        .populate('staffId', 'name email')
        .sort({ createdAt: -1 })
        .lean()

    console.log(`[PAGE] Claims fetched for ${session.user.email} (${session.user.role}): ${claimsDocs.length} items.`)
    if (claimsDocs.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstClaim = claimsDocs[0] as any;
        console.log(`[PAGE] First Claim ID: ${firstClaim._id}, Status: ${firstClaim.status}`)
    }

    // Transform for serialization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const claims = claimsDocs.map((c: any) => ({
        _id: c._id.toString(),
        amount: c.amount,
        category: c.category,
        description: c.description,
        status: c.status,
        rejectionReason: c.rejectionReason,
        staffId: {
            _id: c.staffId._id.toString(),
            name: c.staffId.name,
            email: c.staffId.email
        },
        createdAt: c.createdAt.toISOString()
    }))

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Claims Management</h1>
                    <p className="text-muted-foreground">
                        {session.user.role === 'Staff' ? 'Track and submit your expense claims.' : 'Review and manage staff expense claims.'}
                    </p>
                </div>
                <ClaimSubmissionDialog />
            </div>

            <ClaimList claims={claims} userRole={session.user.role} userId={session.user.id || ''} />
        </div>
    )
}
