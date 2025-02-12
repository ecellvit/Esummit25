import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";



// Correct function signature
export async function GET(
    request: Request, { params } : { params: Promise<{teamCode: string}> }
): Promise<NextResponse> {
  await dbConnect();
    const teamCode = (await params).teamCode;
    try {
        if (!teamCode) {
            return NextResponse.json({ message: "Missing team code." }, { status: 400 });
        }

        console.log("Team Code:", teamCode);

        const team = await TeamModel.findOne({ teamCode: teamCode });

        if (!team) {
            return NextResponse.json({ message: "Team not found." }, { status: 404 });
        }

        return NextResponse.json({ teamName: team.teamName }, { status: 200 });
    } catch (error) {
        console.error("Error joining team:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
