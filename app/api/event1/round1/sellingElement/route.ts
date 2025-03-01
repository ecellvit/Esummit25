import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model"; // Adjust the import path as needed
import TeamModelRound1 from "@/models/event1/event1Round1Team.model"; // Adjust the import path as needed
import calculateMarketPrice from "@/utils/calculateMarketPrice";

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
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
    const marketData = await MarketModel.findOne();

    if (!team) {
        return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    if (!marketData) {
        return NextResponse.json({ message: "Market data not found" }, { status: 404 });
    }

    if (user.event1TeamRole !== 0) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let totalValue = 0;
    const { elements } = await request.json();
    for (const { elementIndex, amount } of elements) {
        // Validate elementIndex
        if (elementIndex < 0 || elementIndex >= 5) {
        return NextResponse.json({ message: "Invalid element index" }, { status: 400 });
        }

        // Check if the team has enough resources to sell
        if (team.portfolio[elementIndex] < amount) {
        return NextResponse.json({ message: "Not enough resources to sell" }, { status: 400 });
        }


        const market = await MarketModel.findOne({ elementId: elementIndex });
        if (!market) {
        return NextResponse.json({ message: "Market data not found" }, { status: 404 });
        }
        // Calculate the total value of the resources being sold
        const marketPrice = market.marketPrice;

        totalValue += amount * marketPrice;

        // Update team's portfolio
        team.portfolio[elementIndex] -= amount;

        console.log('market price',marketData);
        if(elementIndex!=team.primaryElement && elementIndex!=team.secondaryElement && team.portfolio[elementIndex]===0){
            marketData.currentTeams--;
            marketData.marketPrice = calculateMarketPrice(marketData.basePrice, marketData.currentTeams);
            marketData.marketHistory.push(marketData.marketPrice);
            await marketData.save();
        }
        console.log('market data',marketData);
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