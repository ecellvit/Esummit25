import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface Team extends Document {
  teamName: string;
  teamNumber: number;
  teamCode: string;
  teamLeaderId: ObjectId;
  teamLeaderName: string;
  teamLeaderEmail: string;
  teamMembers: [ObjectId];
  isQualified: boolean;
  createdAt: Date,
}

const TeamSchema: Schema<Team> = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, "Team name is required"],
    unique: true,
  },
  teamNumber: {
    type: Number,
    unique: true,
  },
  teamCode: {
    type: String,
    required: [true, "team code is required"],
  },
  teamLeaderId: {
    type: mongoose.Schema.Types.ObjectId,
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
  teamMembers:[{
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

const TeamModel = (mongoose.models.TeamsEvent2 as mongoose.Model<Team>) || (mongoose.model<Team>("TeamsEvent2", TeamSchema));

export default TeamModel;