import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import TeamTokenModel, { TeamToken } from "@/models/event1/TeamToken.model";
import { IUser, Users } from "@/models/user.model";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";


 
export async function POST(request: Request): Promise<NextResponse> {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    const { teamName } = await request.json();
    if (!teamName) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const leader: IUser | null = await Users.findOne({ email: sessionUser.email });
    if (!leader) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!leader.hasFilledDetails) {
      return NextResponse.json({ success: false, message: "User has not filled the details" }, { status: 402 });
    }

    if (!leader.events.includes(1)) {
      return NextResponse.json({ success: false, message: "User has not registered for this event" }, { status: 403 });
    }

    if (!leader.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not part of team" }, { status: 405 });
    }
    const eventId=leader.event1TeamId
    const existingTeam=await TeamModel.findOne({ _id:eventId });
    console.log("bdjhqwdhw",eventId);

    if (!existingTeam) {
      return NextResponse.json({ success: false, message: "team not exist" }, { status: 406 });
    }

    const existingTeamSamename: Team | null = await TeamModel.findOne({ teamName });
    if (existingTeamSamename) {
        return NextResponse.json({ success: false, message: "team with same name already exist" }, { status: 406 });
      }
  
    existingTeam.teamName=teamName;
    await existingTeam.save();
    return NextResponse.json({ success: true, message: "Team name changed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "user registration failed" }, {status: 500});
  }
}