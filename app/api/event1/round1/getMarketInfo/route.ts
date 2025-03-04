import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import MarketModel from "@/models/event1/CommonInfo.model";

export async function GET(request: Request): Promise<NextResponse> {
    await dbConnect();
    
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        console.log("User not authenticated");
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
      }

      const user = await Users.findOne({ email: session.user.email });

      if (!user) {
        console.log("User not found");
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });

      if (!team) {
        console.log("Team not found");
        return NextResponse.json({ message: "Team not found" }, { status: 404 });
      }

      if (user.event1TeamRole) {
        console.log("Unauthorized access");
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const market = await MarketModel.find({}, "elementId marketPrice marketHistory");
      console.log("Market found:", market);

      if (!market) {
        console.log("Market not found");
        return NextResponse.json({ message: "Market not found" }, { status: 404 });
      }
      console.log("Market:", market);

      // Return a response indicating success
      return NextResponse.json({ message: "Market price calculated", marketData: market }, { status: 200 });
    } catch (error) {
      console.error("Error occurred:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}