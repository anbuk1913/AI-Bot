import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContext extends Document {
  userId: string;
  data: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContextSchema: Schema<IContext> = new Schema(
  {
    userId: { type: String, unique: true },
    data: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const Context: Model<IContext> = mongoose.model<IContext>("Context", ContextSchema);

export default Context;
