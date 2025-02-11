import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect(); // Connect to the database

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser?.email) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Find the user by email
    const user = await Users.findOne({ email: sessionUser.email });

    if (!user || !user.event1TeamId) {
      return NextResponse.json(
        { message: "User has no team." },
        { status: 409 }
      );
    }

    const teamId = user.event1TeamId; // Ensure this field is used consistently

    // Validate teamId before querying
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return NextResponse.json(
        { message: "Invalid team ID." },
        { status: 400 }
      );
    }

    // Fetch the team
    const team = await TeamModel.findById(teamId);

    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    // Fetch team members based on event1TeamId instead of _id matching
    const teamMembers = await Users.find(
      { event1TeamId: teamId }, // NEW FIX HERE
      "name email regNo mobNo event1TeamRole"
    );

    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json(
        { message: "No team members found." },
        { status: 404 }
      );
    }

    // Return the team details
    const teamDetails = {
      teamName: team.teamName,
      teamMembersData: teamMembers, // Members details
    };

    return NextResponse.json(teamDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
