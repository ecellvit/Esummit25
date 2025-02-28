import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model"; // Adjust the import path as needed
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import TeamModelRound2, { round2Island } from "@/models/event1/round2Island.model";
import { Types } from "mongoose";



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
            return NextResponse.json({ message: "Team not compelted round 1" }, { status: 404 });
        }

        if (user.event1TeamRole !== 0) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const {entries,islandId,batch}= await request.json();
        console.log(entries,islandId);

        const elementQuantity=[0,0,0,0];
        for(let i=0;i<entries.length;i++){
            elementQuantity[entries[i].element] += entries[i].quantity; // ✅ Fix indexing

        }
        let trans=2;
        if(entries[0].transport=='Air'){
            trans=1;
        }
        const batchData=new TeamModelRound2({
            teamLeaderId:user._id,
            teamLeaderEmail:user.email,
            modeOfTransport:trans,
            elementQuantity:elementQuantity
        })
         await batchData.save();
        
        


        return NextResponse.json({ success: true, message: "successfull" }, { status: 200 });

    }
    catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error saving batchData:", error.message);  // ✅ Log actual error message
            return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
        } else {
            console.error("Unknown error:", error);  // ✅ Handle unexpected error types
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }
}






