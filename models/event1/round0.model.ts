import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for Round0 document
export interface IRound0 extends Document {
  teamId: mongoose.Types.ObjectId;
  teamName: string;
  teamLeaderId: mongoose.Types.ObjectId;
  teamNumber: number;
  leaderName: string;
  leaderEmail: string;
  startTime?: Date;
  endTime?: Date;
  questionPointer: number;
  questionCategory: string;
  easyOrder: number[];
  mediumOrder: number[];
  hardOrder: number[];
  // caseOrder: number[];
  easyAnswers: (string | number | null)[];
  mediumAnswers: (string | number | null)[];
  hardAnswers: (string | number | null)[];
  // caseStudyAnswers: (string | number | null)[];
  points: number;
  // members: mongoose.Types.ObjectId[];
}

const Round0Schema = new Schema<IRound0>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    teamName: {
      type: String,
      unique: true,
    },
    teamLeaderId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    teamNumber: {
      type: Number,
    },
    leaderName: {
      type: String,
    },
    leaderEmail: {
      type: String,
    },
    questionPointer: {
      type: Number,
      default: -1,
    },
    questionCategory: {
      type: String,
      default: "instruction",
    },
    easyOrder: [
      {
        type: Number,
      },
    ],
    mediumOrder: [
      {
        type: Number,
      },
    ],
    hardOrder: [
      {
        type: Number,
      },
    ],
    // caseOrder: [
    //   {
    //     type: Number,
    //   },
    // ],
    easyAnswers: [
      {
        type: Schema.Types.Mixed,
        default: Array(20).fill(null),
      },
    ],
    mediumAnswers: [
      {
        type: Schema.Types.Mixed,
        default: Array(20).fill(null),
      },
    ],
    hardAnswers: [
      {
        type: Schema.Types.Mixed,
        default: Array(20).fill(null),
      },
    ],
    // caseStudyAnswers: [
    //   {
    //     type: Schema.Types.Mixed,
    //     default: Array(4).fill(null),
    //   },
    // ],
    points: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },

    // members: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Users",
    //   },
    // ],
  },
  { collection: "Round0" }
);

export const Round0: Model<IRound0> =
  mongoose.models.Round0 || mongoose.model<IRound0>("Round0", Round0Schema);

// mcq store option No.
// multiple correct store array of correct options. eg. [1,2]
// 10 + 8 + 8 + 4
// easy medium hard caseStudy
//
