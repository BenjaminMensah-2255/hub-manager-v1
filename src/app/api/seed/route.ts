import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();

        const staff = [
            { name: 'mensah', email: 'mensah@asantehub.com', role: 'Admin', department: 'Admin', status: 'Available' },
            { name: 'John Doe', email: 'john@asantehub.com', role: 'Staff', department: 'Engineering', status: 'Available' },
            { name: 'Jane Smith', email: 'jane@asantehub.com', role: 'Supervisor', department: 'Engineering', status: 'On Leave' },
            { name: 'Finance Lead', email: 'finance@asantehub.com', role: 'Supervisor', department: 'Finance', status: 'Available' },
            { name: 'Alice Wonder', email: 'alice@asantehub.com', role: 'Staff', department: 'Creative', status: 'Available' },
        ];

        const results = [];
        for (const s of staff) {
            const res = await Staff.findOneAndUpdate({ email: s.email }, s, { upsert: true, new: true });
            results.push(res);
        }

        return NextResponse.json({ message: 'Database seeded successfully', data: results });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
