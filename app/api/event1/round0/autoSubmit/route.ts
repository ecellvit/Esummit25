import time from "@/constant/round0/time.json";
import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest): Promise<NextResponse> {
  await dbConnect();
  console.log('llllllllllllllllllllllllllllllllllll inside autoSubmit');
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }
    const email = sessionUser.email;
    
    if (!email) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }
    const user = await Users.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const teamData = await TeamModel.findOne({ teamLeaderId: user._id });
    if (!teamData) {
      return NextResponse.json({ message: "Team not found" }, { status: 400 });
    }
    
    await Round0.findOneAndUpdate(
        { teamId: teamData._id },
        {
          questionCategory: 'waiting'
        }
    );

    return NextResponse.json({message: `Successfully set the category to waiting`},{status:200});
    
  } catch (error) {
    return NextResponse.json({message: (error as Error).message},{status:500});
  }
}
