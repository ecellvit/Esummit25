import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Users } from "@/models/user.model";
import mongoose from "mongoose";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model"; // Adjust the import path as needed
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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

        const team = await TeamModelRound1.findById(teamId);
        if (!team) {
            return NextResponse.json({ message: "Team Not Found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, batchNumber: team.batch }, { status: 200 });
    } catch (error) {
        console.error("Error fetching batch number:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
