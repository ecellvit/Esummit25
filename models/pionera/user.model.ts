import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  startupName: string;
  mobileNumber: string; // Change number to string
  driveLink: string;
  collegeName: string;
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    startupName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String, // Changed from number to string
      required: true,
    },
    driveLink: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
  },
  { collection: "pioneraUsers" }
);

export const Users =
  mongoose.models.PioneiraUsers ||
  mongoose.model<User>("PioneiraUsers", userSchema);
