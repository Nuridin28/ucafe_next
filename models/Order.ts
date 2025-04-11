import mongoose, { type Document, Schema } from "mongoose"

interface IOrderItem {
  foodId: mongoose.Types.ObjectId
  quantity: number
  price: number
}

export interface IOrder extends Document {
  orderNumber: string
  userId: mongoose.Types.ObjectId
  items: IOrderItem[]
  total: number
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema({
  foodId: {
    type: Schema.Types.ObjectId,
    ref: "Food",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
})

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
