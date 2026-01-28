import mongoose, { Document, Schema } from "mongoose";

export interface IFood extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const foodSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});

const foodModel =
  mongoose.models.food || mongoose.model<IFood>("food", foodSchema);

export default foodModel;
