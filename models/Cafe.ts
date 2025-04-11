import mongoose, { type Document, Schema } from "mongoose"

export interface ICafe extends Document {
  name: string
  description: string
  openingHours: string
  location: string
}

const CafeSchema = new Schema<ICafe>(
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
    openingHours: {
      type: String,
      required: [true, "Please provide opening hours"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Cafe || mongoose.model<ICafe>("Cafe", CafeSchema)
