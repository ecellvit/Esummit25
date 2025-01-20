import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import TeamTokenModel from "@/models/event1/TeamToken.model";
import { Users } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function DELETE(request: Request): Promise<NextResponse<ApiResponse>> {
  await dbConnect();

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const user = await Users.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    //? User does not have an event1teamId
    if (!user.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not part of a team" }, { status: 400 });
    }

    const team: Team | null = await TeamModel.findById(user.event1TeamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "No team assocated with the user" }, { status: 404 });
    }

    //? Teams with more than 1 member cannot be deleted, 
    //? if there is only one member, then it must be the team leader
    if (team.teamMembers.length !== 1) {
      return NextResponse.json({ success: false, message: "Cannot delete team with more than one member" }, { status: 400 });
    }

    //? Delete the team token
    TeamTokenModel.deleteOne({teamId: team._id});

    //? Delete the team
    TeamModel.findByIdAndDelete(team._id);

    //? Remove the user's associations with the team
    user.event1TeamId = null;
    delete user.event1TeamRole;
    await user.save();

    return NextResponse.json({ success: true, message: "Team deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Team deletion failed" }, {status: 500});
  }
}