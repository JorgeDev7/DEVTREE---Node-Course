import mongoose, { Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});

export const User = mongoose.model<IUser>("User", UserSchema);
