import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import Staff from "@/models/Staff"
import { StaffGrid } from "@/components/directory/staff-grid"

export default async function DashboardPage() {
    const session = await auth()
    await dbConnect()

    // Convert Mongoose docs to plain objects
    const staffDocs = await Staff.find({}).sort({ name: 1 }).lean();
    const staff = staffDocs.map(doc => ({
        _id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        role: doc.role,
        department: doc.department,
        status: doc.status
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
                <p className="text-muted-foreground">
                    View and manage staff status across the Hub.
                </p>
            </div>

            <StaffGrid staff={staff} currentUserEmail={session?.user?.email} />
        </div>
    )
}
