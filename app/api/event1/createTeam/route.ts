import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import TeamTokenModel from "@/models/event1/TeamToken.model";
import { IUser, Users } from "@/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

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
    const { name, email, teamName } = await request.json();

    const leader: IUser | null = await Users.findOne({ email: email });
    if (!leader) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!leader.hasFilledDetails) {
      return NextResponse.json({ message: "User has not filled the details" }, { status: 400 });
    }

    if (!leader.events.includes(1)) {
      return NextResponse.json({ message: "User has not registered for this event" }, { status: 400 });
    }

    if (leader.event1TeamId) {
      return NextResponse.json({ message: "User is already part of a team" }, { status: 400 });
    }

    const existingTeam: Team | null = await TeamModel.findOne({ teamName });

    if (existingTeam) {
      return NextResponse.json({ message: "Team with the same name already exists" }, { status: 400 });
    }

    const teamCode = await generateUniqueTeamCode();

    const team: Team = new TeamModel({
      teamName: teamName,
      teamCode: teamCode,
      teamLeaderId: leader._id,
      teamLeaderName: name,
      teamLeaderEmail: email,
      teamMembers: [leader._id],
    });
    await team.save();

    const teamToken = new TeamTokenModel({
      teamId: team._id,
      code: teamCode,
    });
    await teamToken.save();

    leader.event1TeamRole = 0;

    if (!(team._id instanceof Types.ObjectId)) {
      return NextResponse.json({ message: "Error creating team" }, { status: 400 });
    }
    leader.event1TeamId = team._id;
    await leader.save();

    return NextResponse.json({ message: "Team created successfully", teamCode: teamCode }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "user registration failed" }, {status: 500});
  }
}