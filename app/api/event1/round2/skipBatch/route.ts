import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import IslandRound2 from "@/models/event1/round2Island.model";
import mongoose from "mongoose";
import insuranceData from "@/constant/round2/insurance.json";

export async function POST(request: Request): Promise<NextResponse> {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    if (!session || !sessionUser) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    const user = await Users.findOne({ email: sessionUser?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
    if (!team) {
      return NextResponse.json(
        { message: "Team not completed round 1" },
        { status: 404 }
      );
    }

    if (user.event1TeamRole !== 0) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    var batchNumber: number = team.batch;

    if (batchNumber >= 4) {
      return NextResponse.json(
        { message: "Only 3 batches are allowed" },
        { status: 450 }
      );
    }

    let batchArray: (mongoose.Schema.Types.ObjectId | null)[] = [];
    if (batchNumber === 1) {
      batchArray = team.islandBatch1;
      team.islandBatch1 = [];
    } else if (batchNumber === 2) {
      batchArray = team.islandBatch2;
      team.islandBatch2 = [];
    } else if (batchNumber === 3) {
      batchArray = team.islandBatch3;
      team.islandBatch3 = [];
    }

    // for (const batchId of batchArray) {
    //   if (!batchId) continue;

    //   const batchData = await IslandRound2.findById(batchId);
    //   if (!batchData) continue;

    //   // Revert the portfolio changes
    //   batchData.elementQuantity.forEach((quantity, index) => {
    //     team.portfolio[index] += quantity;
    //   });

    //   await IslandRound2.deleteOne({ _id: batchId });
    // }

    // Set insurance to -1 and increase the batch number
    team.insuranceType.push(-1);
    team.batch = batchNumber + 1;
    await team.save();

    return NextResponse.json(
      { success: true, message: "Batch skipped successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error skipping batch:", error.message);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
