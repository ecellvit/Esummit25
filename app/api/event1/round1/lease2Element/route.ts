import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model"; // Adjust the import path as needed
import MarketModel from "@/models/event1/CommonInfo.model";
import resourceData from '@/constant/round1/element.json'
import calculateMarketPrice from "@/utils/calculateMarketPrice";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();
    console.log("Database connected");

    try {
        console.log("Request received");

        const session = await getServerSession(authOptions);
        console.log("Session retrieved:", session);

        if (!session?.user) {
            console.log("User not authenticated");
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        const user = await Users.findOne({ email: session.user.email });
        console.log("User found:", user);

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
        console.log("Team found:", team);

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
        const rate = body?.elementRate;

        console.log("Received elementId:", id);
        console.log("Received elementRate:", rate);

        if (team.lease2Element || team.lease2Rate   ) {
            console.log("Team has already purchased an element");
            return NextResponse.json({ message: "Cannot purchase again" }, { status: 410 });
        }

        if (isNaN(id) || isNaN(rate)) {
            console.log("Invalid ID or Rate:", id, rate);
            return NextResponse.json({ message: "id and rate are required" }, { status: 400 });
        }

        if (team.lease2Element === team.primaryElement || team.lease2Element === team.secondaryElement){
            console.log("Element is already purchased previously")
            return NextResponse.json({ message: "Element is already purchased"}, {status: 406})
        }

        const element = resourceData.find(el => el.id === id);
        if (!element) {
            console.log("Element not found in data");
            return NextResponse.json({ message: "Element not found" }, { status: 404 });
        }
        if (team.wallet < element.cost) {
            console.log("Insufficient funds");
            return NextResponse.json({ message: "Insufficient funds" }, { status: 402 });
        }

        team.lease2Element = id;
        team.lease2Rate  = rate;
        team.wallet -= element.cost;

        console.log("Updating team data:", team);

        await team.save();  // This is likely where the log is happening

        console.log("Team updated successfully");

        const marketData = await MarketModel.findOne({ elementId: id });

        if (!marketData) {
            console.log("Creating new market data entry for elementId:", id);
            await MarketModel.create({
                elementId: id,
                currentTeams: 1,
                basePrice: resourceData[id].base,
                marketPrice: calculateMarketPrice(resourceData[id].base, 1),
            });
        } else {
            console.log("Updating market data for elementId:", id);
            marketData.currentTeams++;
            marketData.marketPrice = calculateMarketPrice(marketData.basePrice, marketData.currentTeams);
            await marketData.save();
        }

        console.log("Market data updated successfully");

        return NextResponse.json(
            { success: true, message: "Element purchased successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error processing purchase:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error"},
            { status: 500 }
        );
    }
}
