import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPriceData extends Document {
  vs_currency: string;
  days: number;
  prices: { timestamp: number; price: number }[];
  lastUpdated: Date;
}

const priceDataSchema: Schema = new Schema({
  vs_currency: { type: String, required: true },
  days: { type: Number, required: true },
  prices: [{ timestamp: Number, price: Number }],
  lastUpdated: { type: Date, default: Date.now },
});

const PriceData: Model<IPriceData> = mongoose.model<IPriceData>('PriceData', priceDataSchema);

export { PriceData, IPriceData };
