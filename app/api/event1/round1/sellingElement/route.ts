import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model"; // Adjust the import path as needed
import TeamModelRound1 from "@/models/event1/event1Round1Team.model"; // Adjust the import path as needed

// Sell Route Handler
export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();
    try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    if (!sessionUser) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }
    const user = await Users.findOne({ email: sessionUser.email });
    const teamId = user.event1TeamId;
    const team = await TeamModelRound1.findById(teamId);
    const marketData = await MarketModel.findOne();

    if (!team) {
        return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    if (!marketData) {
        return NextResponse.json({ message: "Market data not found" }, { status: 404 });
    }

    if (user.event1TeamRole){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let totalValue = 0;
    const elements = await request.json();

    for (const { elementIndex, amount } of elements) {
        // Validate elementIndex
        if (elementIndex < 0 || elementIndex >= 5) {
        return NextResponse.json({ message: "Invalid element index" }, { status: 400 });
        }

        // Check if the team has enough resources to sell
        if (team.portfolio[elementIndex] < amount) {
        return NextResponse.json({ message: "Not enough resources to sell" }, { status: 400 });
        }

        // Calculate the total value of the resources being sold
        const marketPrice = (marketData.basePrice[elementIndex]) + ((0.4 - (marketData.currentTeams[elementIndex]/40))*175);
        totalValue += amount * marketPrice;

        // Update team's portfolio
        team.portfolio[elementIndex] -= amount;
    }

    // Update team's wallet
    team.wallet += totalValue;
    await team.save();

    return NextResponse.json({
        message: "Resources sold successfully",
        newWalletBalance: team.wallet,
        remainingResources: team.portfolio,
    }, { status: 200 });
    } catch (error) {
    console.error("Error selling resources:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}