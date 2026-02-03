"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { approveClaim, rejectClaim } from "@/actions/claim-actions"
import { Check, X, Clock, AlertCircle } from "lucide-react"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ClaimType {
    _id: string;
    amount: number;
    category: string;
    description: string;
    status: string;
    rejectionReason?: string;
    staffId: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

export function ClaimList({ claims, userRole, userId }: { claims: ClaimType[], userRole: string, userId: string }) {
    const [rejectId, setRejectId] = useState<string | null>(null)

    const handleApprove = async (id: string) => {
        // Add optimistic UI or loading state if needed
        await approveClaim(id)
    }

    const handleReject = async (id: string, reason: string) => {
        await rejectClaim(id, reason)
        setRejectId(null)
    }

    return (
        <div className="grid gap-4">
            {claims.map((claim) => (
                <Card key={claim._id} className="relative">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    ${claim.amount.toFixed(2)}
                                    <Badge variant="outline">{claim.category}</Badge>
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Submitted by <span className="font-medium text-foreground">{claim.staffId.name}</span> on {new Date(claim.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <StatusBadge status={claim.status} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{claim.description}</p>
                        {claim.status === 'Rejected' && claim.rejectionReason && (
                            <div className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Reason: {claim.rejectionReason}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-muted/40 pt-2 pb-2">
                        {/* Actions for Supervisors if Pending */}
                        {claim.status === 'Pending' && (userRole === 'Supervisor' || userRole === 'Admin') && (
                            <>
                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => handleApprove(claim._id)}>
                                    <Check className="mr-1 h-3 w-3" /> Approve
                                </Button>
                                <Dialog open={rejectId === claim._id} onOpenChange={(open: boolean) => setRejectId(open ? claim._id : null)}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                            <X className="mr-1 h-3 w-3" /> Reject
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reject Claim</DialogTitle>
                                            <DialogDescription>Please provide a reason for rejection.</DialogDescription>
                                        </DialogHeader>
                                        <RejectForm claimId={claim._id} onSubmit={handleReject} onClose={() => setRejectId(null)} />
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                        {/* Status specific message for user? */}
                        {(userRole !== 'Supervisor' && userRole !== 'Admin') && claim.status === 'Pending' && (
                            <span className="text-xs text-muted-foreground italic">Awaiting approval</span>
                        )}
                    </CardFooter>
                </Card>
            ))}
            {claims.length === 0 && <p className="text-center text-muted-foreground py-10">No claims found.</p>}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'Approved') return <Badge className="bg-green-600 hover:bg-green-700"><Check className="mr-1 h-3 w-3" /> Approved</Badge>
    if (status === 'Rejected') return <Badge variant="destructive"><X className="mr-1 h-3 w-3" /> Rejected</Badge>
    return <Badge variant="secondary" className="text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>
}

// Separate component to handle form state
function RejectForm({ claimId, onSubmit, onClose }: { claimId: string, onSubmit: (id: string, r: string) => void, onClose: () => void }) {
    const [reason, setReason] = useState("")
    return (
        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); onSubmit(claimId, reason); }}>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Reason</Label>
                    <Textarea
                        value={reason}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                        required
                        placeholder="e.g. Amount exceeds policy limit"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="destructive">Reject</Button>
            </DialogFooter>
        </form>
    )
}
