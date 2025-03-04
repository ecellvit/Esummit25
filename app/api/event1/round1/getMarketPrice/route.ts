import { NextResponse } from "next/server";
import calculateMarketPrice from "@/utils/calculateMarketPrice";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import MarketModel from "@/models/event1/CommonInfo.model";
import resourceData from '@/constant/round1/element.json'
// the request should contain the element index and wether the team is acquiring the element or losing it.
// the response should contain the new market price for the element.
// if the team is acquiring then the request should be 1, if the team is losing the element then the request should be 0.
export async function GET(request: Request): Promise<NextResponse> {
    await dbConnect();
    console.log("Database connected");

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

        const body = await request.json();
        console.log("Request body:", body);

        const id = body?.elementId;
        const entry = body?.entry;

        console.log("Received elementId:", id);

        const element = resourceData.find((element) => element.id === id);
        console.log("Element found:", element);

        if (!element) {
            console.log("Element not found");
            return NextResponse.json({ message: "Element not found" }, { status: 404 });
        }

        const market = await MarketModel.findOne({ elementId: id });
        console.log("Market found:", market);

        if (!market) {
            console.log("Market not found");
            return NextResponse.json({ message: "Market not found" }, { status: 404 });
        }

        if (entry === 1) {
            market.currentTeams += 1;
        } else if (entry === 0) {
            market.currentTeams -= 1;
        } else {
            console.log("Invalid entry");
        }

        const mp = calculateMarketPrice(market.basePrice, market.currentTeams);
        market.marketPrice = mp;
        market.marketHistory.push(mp);
        await market.save();
        console.log("Market price calculated:", mp);

        // Return a response indicating success
        return NextResponse.json({ message: "Market price calculated", marketPrice: mp }, { status: 200 });
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}