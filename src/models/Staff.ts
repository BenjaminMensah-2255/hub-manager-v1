import mongoose, { Schema, model, models } from 'mongoose';

export interface IStaff {
    _id?: string;
    name: string;
    email: string;
    role: 'Staff' | 'Supervisor' | 'Admin';
    department: 'Engineering' | 'Creative' | 'Finance' | 'Admin';
    status: 'Available' | 'On Leave' | 'Out of Office';
    joinedDate: Date;
}

const StaffSchema = new Schema<IStaff>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Staff', 'Supervisor', 'Admin'], default: 'Staff' },
    department: { type: String, enum: ['Engineering', 'Creative', 'Finance', 'Admin'], required: true },
    status: { type: String, enum: ['Available', 'On Leave', 'Out of Office'], default: 'Available' },
    joinedDate: { type: Date, default: Date.now },
});

const Staff = models.Staff || model<IStaff>('Staff', StaffSchema);
export default Staff;
