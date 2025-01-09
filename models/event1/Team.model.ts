import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface Team extends Document {
  name: string;
  number: number;
  token: ObjectId;
  leaderId: ObjectId;
  leaderName: string;
  leaderEmail: string;
  members: [ObjectId];
  isQualified: boolean;
  createdAt: Date,
}

const TeamSchema: Schema<Team> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Team name is required"],
    unique: true,
  },
  number: {
    type: Number,
    required: [true, "Team number is required"],
    unique: true,
  },
  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamTokens",
    required: [true, "Team token is required"],
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Team leader is required"],
  },
  leaderName: {
    type: String,
    required: [true, "Team leader name is required"],
  },
  leaderEmail: {
    type: String,
    required: [true, "Team leader email is required"],
    unique: true,
  },
  members:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Team members are required"],
  }],
  isQualified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TeamModel = (mongoose.models.TeamsEvent1 as mongoose.Model<Team>) || (mongoose.model<Team>("TeamsEvent1", TeamSchema));

export default TeamModel;