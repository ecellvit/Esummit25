import time from '@/constant/round0/time.json';
import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from '@/models/event1/Team.model';
import { Users } from "@/models/user.model";
import { getTokenDetails } from "@/utils/cn";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {

  await dbConnect();
  console.log('inside route');
  
  const token = await getToken({ req });
  const auth = token
    ? token.accessTokenFromBackend as string
    : req.headers.get("Authorization")?.split(" ")[1] || "";
    
  let userId = await getTokenDetails(auth);

  try {
    // Fetch the team based on the leader's userId
    const qualTeam = await TeamModel.findOne({ teamLeaderId: userId });

    if (!qualTeam) {
      return NextResponse.json({ message: "team not found" }, { status: 404 });
    }

    // Fetch the Round0 document associated with this team
    const round0Data = await Round0.findOne({ teamId: qualTeam._id });

    const quizStartTime = new Date("October 2, 2024 23:37:00");
    const currentTime = new Date();
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
