import mongoose, { type Document, Schema } from "mongoose"

export interface IFood extends Document {
  name: string
  description: string
  price: number
  category: string
  quantity: number
  imageUrl?: string
}

const FoodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["main", "side", "dessert", "drink"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a quantity"],
      min: 0,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Food || mongoose.model<IFood>("Food", FoodSchema)
