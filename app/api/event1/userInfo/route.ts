import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import event1Round1TeamModel from "@/models/event1/event1Round1Team.model";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    try {
      const session = await getServerSession(authOptions);
      const sessionUser = session?.user;
      if (!session || !sessionUser?.email) {
        return NextResponse.json(
          { success: false, message: "User Not Authenticated" },
          { status: 401 }
        );
      }
  
      const user = await Users.findOne({ email: sessionUser.email });
      if (!user || !user.event1TeamId) {
        return NextResponse.json(
          { message: "User has No Team" },
          { status: 409 }
        );
      }
  
      const teamId = user.event1TeamId;
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return NextResponse.json(
          { message: "Invalid Team ID" },
          { status: 400 }
        );
      }
  
      const team = await TeamModel.findById(teamId).populate({
        path: "teamMembers",
        select: "name email regNo mobNo event1TeamRole",
      });
      if (!team) {
        return NextResponse.json({ message: "Team Not Found" }, { status: 404 });
      }
  
      const round1 = await event1Round1TeamModel.findOne({ teamName: team.teamName });
      if (!round1) {
        return NextResponse.json({ message: "Team Not Qualified for Round 1" }, { status: 403 });
      }
  
      return NextResponse.json({ success: true, team:round1 }, { status: 200 });
    } catch (error) {
      console.error("Error Checking Round 1 Access: ", error);
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
  }