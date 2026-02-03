'use server'

import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import Claim from "@/models/Claim"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitClaim(formData: FormData) {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized")
    }

    const amount = formData.get('amount')
    const category = formData.get('category')
    const description = formData.get('description')

    if (!amount || !category || !description) {
        throw new Error("Missing required fields")
    }

    await dbConnect()

    await Claim.create({
        staffId: session.user.id,
        amount: parseFloat(amount.toString()),
        category,
        description,
        status: 'Pending'
    })

    revalidatePath('/claims')
}

export async function approveClaim(claimId: string) {
    const session = await auth()
    console.log(`[ACTION] approveClaim called by ${session?.user?.email} for claim ${claimId}`)

    // In real app, verify role is Supervisor or Admin
    if (!session?.user?.role || (session.user.role !== 'Supervisor' && session.user.role !== 'Admin')) {
        console.error(`[ACTION] Unauthorized attempt to approve by ${session?.user?.email}`)
        throw new Error("Unauthorized")
    }

    await dbConnect()
    const result = await Claim.findByIdAndUpdate(claimId, { status: 'Approved' }, { new: true })
    console.log(`[ACTION] Claim ${claimId} updated. New status: ${result?.status}`)

    revalidatePath('/claims')
}

export async function rejectClaim(claimId: string, reason: string) {
    const session = await auth()
    if (!session?.user?.role || (session.user.role !== 'Supervisor' && session.user.role !== 'Admin')) {
        throw new Error("Unauthorized")
    }

    await dbConnect()
    await Claim.findByIdAndUpdate(claimId, { status: 'Rejected', rejectionReason: reason })
    revalidatePath('/claims')
}
