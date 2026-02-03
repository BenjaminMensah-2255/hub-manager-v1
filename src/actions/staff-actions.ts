'use server'

import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import Staff from "@/models/Staff"
import { revalidatePath } from "next/cache"

export async function updateMyStatus(newStatus: string) {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
        throw new Error("Unauthorized")
    }

    // Validate status
    const validStatuses = ['Available', 'On Leave', 'Out of Office']
    if (!validStatuses.includes(newStatus)) {
        throw new Error("Invalid status")
    }

    await dbConnect()

    await Staff.findOneAndUpdate(
        { email: session.user.email },
        { status: newStatus }
    )

    revalidatePath("/")
}
