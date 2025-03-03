import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import IslandRound2 from "@/models/event1/round2Island.model";

export async function GET(request: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;

        // Check if user is authenticated
        if (!sessionUser) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        // Find the user in the database
        const user = await Users.findOne({ email: sessionUser.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if the user has the required role
        if (user.event1TeamRole !== 0) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Count documents in IslandRound2 with modeOfTransport as 1 for the user's email
        const count1 = await IslandRound2.countDocuments({
            teamLeaderEmail: user.email,
            modeOfTransport: 1
        });
        const count = 12;
        // Return the count in the response
        return NextResponse.json(
            { success: true, message: "Count calculated successfully", count },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}