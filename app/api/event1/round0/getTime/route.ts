import time from "@/constant/round0/time.json";
import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET request to set or retrieve start and end time for a team in Round0
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Connect to MongoDB
  await dbConnect();
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!session || !sessionUser) {
    return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
  }
  const email = sessionUser.email;

  if (!email) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
  const user = await Users.findOne({ email: email });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }
  const userId = user._id;
  if (!userId) {
    return NextResponse.json({ success: false, message: "User id not found" }, { status: 404 });
  }
  try {
    const startTime = new Date().getTime();
    const endTime = startTime + 1000 * 60 * time.round0; // Add quiz duration


    // Use findOne to directly query for the user's team by teamLeaderId
    const team = await TeamModel.findOne({ teamLeaderId: userId });

    if (!team) {
      // If no team is found for the user, return an error
      return NextResponse.json({ message: "Team not found for this user." }, { status: 404 });
    }

    const teamId = team._id;  // Extract team ID
    const teamData = await Round0.findOne({ teamId: teamId });

    if (!teamData?.startTime) {
      // If startTime is not set, update the document with startTime and endTime
      await Round0.findOneAndUpdate(
        { teamId: teamId },
        { startTime, endTime },
        { new: true }
      );
      return NextResponse.json(
        {
          message: "Time set successfully",
          startTime,
          endTime,
        },
        { status: 200 }
      );
    } else {
      // If the time is already set, return the existing startTime and endTime
      return NextResponse.json(
        {
          message: "Time already set",
          startTime: teamData.startTime,
          endTime: teamData.endTime,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error:", error);  // Log the error
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
