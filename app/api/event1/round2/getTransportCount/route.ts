import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import IslandRound2 from "@/models/event1/round2Island.model";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();
    try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    if (!session || !sessionUser) {
        return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
        );
    }
    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find documents in round2Island with modeOfTransport as 1 for the user's email
    const count = await IslandRound2.countDocuments({
        teamLeaderEmail: user.email,
        modeOfTransport: 1
    });

    return NextResponse.json(
        { success: true, message: "Count calculated successfully", count },
        { status: 200 }
    );
    } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Error calculating count:", error.message);
        return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
        );
    } else {
        console.error("Unknown error:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
    }
}