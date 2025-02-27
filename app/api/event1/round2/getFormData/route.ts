import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model"; // Adjust the import path as needed
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import TeamModelRound2 from "@/models/event1/round2Island.model";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();
    try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    if (!sessionUser) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }
    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
    // const marketData = await MarketModel.findOne();

    if (!team) {
        return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }


    if (user.event1TeamRole !== 0) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    
    const { elements } = await request.json();
    for (const { elementIndex, amount } of elements) {
        // Validate elementIndex
        if (elementIndex < 0 || elementIndex >= 5) {
        return NextResponse.json({ message: "Invalid element index" }, { status: 400 });
        }

        if (team.portfolio[amount] == 0){
            
        }
        // Check if the team has enough resources to sell
        if (team.portfolio[elementIndex] < amount) {
        return NextResponse.json({ message: "Not enough resources to transport" }, { status: 400 });
        }

        // Update team's portfolio
        team.portfolio[elementIndex] -= amount;
    }
    const nonZeroPortfolio = Object.entries(team.portfolio)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({ element: key, amount: value }));

await team.save();

return NextResponse.json({
    message: "Resources sold successfully",
    newWalletBalance: team.wallet,
    remainingResources: nonZeroPortfolio,
}, { status: 200 });
    } catch (error) {
    console.error("Error selling resources:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}