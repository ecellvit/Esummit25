import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model"; // Adjust the import path as needed

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        console.log('Request received');
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;

        if (!sessionUser) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        const user = await Users.findOne({ email: sessionUser.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log('User found:', user);

        const teamId = user.event1TeamId;
        const team = await TeamModelRound1.findById(teamId);
        console.log('Team found:', team);

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        if (user.event1TeamRole) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        console.log('Request body:', body);

        const id = body?.elementId;
        console.log('dsa',isNaN(id));
        const rate = body?.elementRate;
        console.log('dfads',rate);
        // const {elementId,elementRate} = await request.json();

        if (team.primaryElement !== null || team.primaryRate !== null){
            return NextResponse.json({message: "Cannot purchase again"}, {status: 410});
        }
        if (isNaN(id) || !rate) {
            return NextResponse.json({ message: "id and rate are required" }, { status: 400 });
        }

        team.primaryElement = id;
        team.primaryRate = rate;
        await team.save();

        return NextResponse.json(
            { success: true, message: "Element purchased successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error processing purchase:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
