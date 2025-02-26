import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface round2Island extends Document {
    teamLeaderId: ObjectId;
    teamLeaderName: string;
    teamLeaderEmail: string;
    teamName: string;
    wallet: number;
    startTime: Date;
    totalQuantity: number;
    islandElement: number[][];
    elementBatch1: number[];
    elementBatch2: number[];
    elementBatch3: number[];
    insuranceType: number[];

}

const TeamSchema: Schema<round2Island> = new Schema(
{
    teamLeaderId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "Team leader is required"],
    },
    teamLeaderName: {
        type: String,
        required: [true, "Team leader name is required"],
    },
    teamLeaderEmail: {
        type: String,
        required: [true, "Team leader email is required"],
        unique: true,
    },
    teamName:{
        type: String,
        required: [true, "Team name is required"],
    },
    wallet:
    {
        type: Number,
        required: [true, "Wallet is required"],
    },
    portfolio:
    {
        type: [Number],
        required: [true, "Portfolio is required"],
    },
    page:
    {
        type: Number,
        required: [true, "Page is required"],
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    totalQuantity: {
        type: Number,
    },
    
},
    { collection: "TeamsEvent1Round1" }
);

const TeamModelRound1 = (mongoose.models.TeamsEvent1Round1 as mongoose.Model<round2Island>) || (mongoose.model<round2Island>("TeamsEvent1Round1", TeamSchema));

export default TeamModelRound1;