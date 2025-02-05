import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import TeamTokenModel, { TeamToken } from "@/models/event1/TeamToken.model";
import { IUser, Users } from "@/models/user.model";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

async function generateUniqueTeamCode() {
  let teamCode;
  let isUnique = false;

  // Keep generating new codes until we find a unique one
  while (!isUnique) {
    teamCode = Math.random().toString(36).substring(2, 10);
    const existingTeam = await TeamModel.findOne({ teamCode });
    if (!existingTeam) {
      isUnique = true;
    }
  }

  return teamCode;
}

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

    if (leader.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is already part of a team" }, { status: 405 });
    }

    const existingTeam: Team | null = await TeamModel.findOne({ teamName });

    if (existingTeam) {
      return NextResponse.json({ success: false, message: "Team with the same name already exists" }, { status: 406 });
    }

    const teamCode = await generateUniqueTeamCode();

    const team: Team = new TeamModel({
      teamName: teamName,
      teamCode: teamCode,
      teamLeaderId: leader._id,
      teamLeaderName: sessionUser.name,
      teamLeaderEmail: sessionUser.email,
      teamMembers: [leader._id],
    });
    await team.save();

    const teamToken: TeamToken = new TeamTokenModel({
      teamId: team._id,
      teamCode: teamCode,
    });
    await teamToken.save();

    leader.event1TeamRole = 0;

    if (!(team._id instanceof Types.ObjectId)) {
      return NextResponse.json({ success: false, message: "Error creating team" }, { status: 407 });
    }
    leader.event1TeamId = team._id;
    await leader.save();

    return NextResponse.json({ success: true, message: "Team created successfully", teamCode: teamCode }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "user registration failed" }, {status: 500});
  }
}