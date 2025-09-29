import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContext extends Document {
  userId: string;
  history: string[];
  context: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IContext> = new Schema(
  {
    userId: { type: String, unique: true },
    history: { type: [String], required: true },
    context: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const User: Model<IContext> = mongoose.model<IContext>("Patient-Data", userSchema);

export default User;