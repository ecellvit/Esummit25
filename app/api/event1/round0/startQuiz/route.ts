import time from '@/constant/round0/time.json';
import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from '@/models/event1/Team.model';
import { Users } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest): Promise<NextResponse> {

  await dbConnect();
  console.log('inside route');
  
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

  try {
    // Fetch the team based on the leader's userId
    const qualTeam = await TeamModel.findOne({ teamLeaderId: user._id });

    if (!qualTeam) {
      return NextResponse.json({ message: "team not found" }, { status: 404 });
    }

    // Fetch the Round0 document associated with this team
    const round0Data = await Round0.findOne({ teamId: qualTeam._id });

    const quizStartTime = new Date("February 28, 2025 18:44:00");
    const currentTime =  new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    console.log('Current Time:', currentTime);
    console.log('Quiz Start Time:', quizStartTime);

    if (currentTime < quizStartTime) {
      return NextResponse.json({
        message: "Quiz has not started yet",
        canStart: false,
      }, { status: 403 });
    } else {
      // Log the existing round0Data for debugging
      console.log("Existing Round0 Data:", round0Data);

      if (round0Data?.questionCategory !== 'medium' || round0Data?.questionPointer !== 0) {
        // Update only if the values are not already set to the desired state
        const updatedData = await Round0.findOneAndUpdate(
          { teamId: qualTeam._id },
          {
            $set: {
              questionCategory: 'medium',
              questionPointer: 0,
            },
          },
          { new: true } // Return the updated document
        );

        // Log the updated document for debugging
        console.log("Updated Round0 Data:", updatedData);
        
        return NextResponse.json({ message: 'Round0 started', data: updatedData }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Round0 already started' }, { status: 200 });
      }
    }
  } catch (error: any) {
    console.error('Error in starting the quiz:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
