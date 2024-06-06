import { Schema, model, Document } from 'mongoose';

interface IOrder extends Document {
    userId: Schema.Types.ObjectId;
    seedsType: string;
    seedsAmount: number;
    fertilizerType: string;
    fertilizerAmount: number;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const orderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seedsType: { type: String, required: true },
    seedsAmount: { type: Number, required: true },
    fertilizerType: { type: String, required: true },
    fertilizerAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const Order = model<IOrder>('Order', orderSchema);

export default Order;
