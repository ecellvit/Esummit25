import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  founderName: string,
  email: string,
  startupEmail:string,
  startupName: string,
  primaryMobileNumber: number,
  alternateMobileNumber:number,
  educationalInstitution: string,
  websiteLink:string,
  startupStage:string,
  technologyReadinessLevel:string,
  portfolioLink:string,
  hasFilledDetails:boolean,
}

const userSchema = new Schema<User>(
  {
    founderName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    startupEmail:{
      type:String,
      required:true,
    },
    startupName: {
      type: String,
      required: true,
    },
    primaryMobileNumber: {
      type: Number, // Changed from number to string
      required: true,
    },
    alternateMobileNumber:{
      type:Number,
      required:true
    },
    educationalInstitution: {
      type: String,
      required: true,
    },
    websiteLink: {
      type: String,
      required: false,
    },
    startupStage: {
      type: String,
      required: true,
    },
    technologyReadinessLevel: {
      type: String,
      required: true,
    },
    portfolioLink: {
      type: String,
      required: true,
    },
    hasFilledDetails: {
      type: Boolean,
      default: false,
    }
  },
  { collection: "PioneiraUsers" }
);

export const Users =
  mongoose.models.PioneiraUsers ||
  mongoose.model<User>("PioneiraUsers", userSchema);
