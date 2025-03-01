import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import TeamModelRound2 from "@/models/event1/round2Island.model";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const sessionUser  = session?.user;
        if (!sessionUser ) {
            return NextResponse.json({ message: "User  not authenticated" }, { status: 401 });
        }
        const user = await Users.findOne({ email: sessionUser .email });
        if (!user) {
            return NextResponse.json({ message: "User  not found" }, { status: 404 });
        }
        const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        if (user.event1TeamRole !== 0) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Return the portfolio as teamElements
        const teamElements = team.portfolio; // Assuming portfolio is an object with element names as keys
        const batchNumber = team.batch; // 1, 2, or 3
        const batchKey = `islandBatch${batchNumber}`; // Create the key dynamically
        const islandBatch = (team as any)[batchKey]; // Typecasting team as 'any' to access the dynamic key



        return NextResponse.json({
            message: "Data fetched successfully",
            teamElements: teamElements,
            islandBatch: islandBatch ?? "",
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
