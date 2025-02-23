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
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
    const marketData = await MarketModel.findOne();
    console.log("user", user);
    console.log("team", team);
    console.log("marketData", marketData);

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
    console.log("elements", elements);
    for (const { elementIndex, amount } of elements) {
      console.log("elementIndex", elementIndex);
      console.log("amount", amount);
      // Validate elementIndex
      if (elementIndex < 0 || elementIndex >= 5) {
        return NextResponse.json({ message: "Invalid element index" }, { status: 400 });
      }

      // Check if the team has enough resources to sell
      if (team.portfolio[elementIndex] < amount) {
        return NextResponse.json({ message: "Not enough resources to sell" }, { status: 400 });
      }

      // Calculate the total value of the resources being sold
      const marketPrice = marketData.basePrice[elementIndex] + ((0.4 - (marketData.currentTeams[elementIndex] / 40)) * 175);
      
      console.log("marketPrice", marketPrice);
      console.log("amount",amount);
      totalValue += amount * marketPrice;

      console.log(team.portfolio[elementIndex])

      // Update team's portfolio
      team.portfolio[elementIndex] -= amount;
    }
    console.log("totalValue", totalValue);
    console.log("team.portfolio", team.portfolio);
    // Update team's wallet
    team.wallet += totalValue;
    console.log("team.wallet", team.wallet);
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