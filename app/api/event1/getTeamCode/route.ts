import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { Users } from "@/models/user.model";
import { dbConnect } from '@/lib/dbConnect';
import TeamModel from "@/models/event1/Team.model";

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const userId =  await req.json();

        //find the user's team by user ID
        const teamId = await Users.findById(userId).populate('event1TeamId');
        if (!teamId) {
            return NextResponse.json({ message: "User has no team." }, { status: 404 });
        }

        // find out if user is leader or not
        const userRole = teamId.event1TeamRole;
        if (userRole) {
            return NextResponse.json({ message: "User is member." });
        }

        const team = await TeamModel.findOne({ teamId });
        return NextResponse.json(team?.teamCode);
    } catch (error) {
        console.error("Error joining team:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}