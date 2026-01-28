import mongoose, { Document, Schema } from "mongoose";

interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  [key: string]: any;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  amount: number;
  address: object;
  status: string;
  date: Date;
  payment: boolean;
}

const orderSchema: Schema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

const orderModel =
  mongoose.models.order || mongoose.model<IOrder>("order", orderSchema);

export default orderModel;
