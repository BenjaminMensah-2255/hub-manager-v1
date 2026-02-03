import mongoose, { Schema, model, models } from 'mongoose';

export interface IClaim {
    _id?: string;
    staffId: mongoose.Types.ObjectId | string;
    amount: number;
    category: 'Travel' | 'Equipment' | 'Operations';
    description: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    rejectionReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ClaimSchema = new Schema<IClaim>({
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ['Travel', 'Equipment', 'Operations'], required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    rejectionReason: { type: String },
}, { timestamps: true });

const Claim = models.Claim || model<IClaim>('Claim', ClaimSchema);
export default Claim;
