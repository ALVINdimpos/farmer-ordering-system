import { Schema, model, Document } from 'mongoose';

interface IProduct extends Document {
    productName: string;
    productType: 'Seed' | 'Fertilizer';
    suitableLandSize: number; 
}

const productSchema = new Schema<IProduct>({
    productName: { type: String, required: true, unique: true },
    productType: { type: String, required: true, enum: ['Seed', 'Fertilizer'] },
    suitableLandSize: { type: Number, required: true }
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
