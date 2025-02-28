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

    try {
        console.log("Request received");

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

        if (!team) {
            console.log("Team not found");
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        if (user.event1TeamRole !== 0) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        console.log('Request body:', body);

        const id = body?.elementId;
        const rate = body?.elementRate;

        console.log("Received elementId:", id);
        console.log("Received elementRate:", rate);

        if (team.secondaryElement || team.secondaryRate ){
            console.log("Team has already purchased an element");
            return NextResponse.json({message: "Cannot purchase again"}, {status: 410});
        }
        
        if (isNaN(id) || !rate) {
            return NextResponse.json({ message: "id and rate are required" }, { status: 400 });
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

        if (id === team.primaryElement){
            return NextResponse.json({ message: "Already purchased as primary element" }, {status: 406})
        }
        

        team.secondaryElement = id;
        team.secondaryRate = rate;
        team.wallet -= element.cost;
        
        await team.save();

        // Get all market data records to update histories
        const allMarketData = await MarketModel.find({});

        const marketData = await MarketModel.findOne({ elementId: id });
        if (!marketData) {
            await MarketModel.create({
                elementId: id,
                currentTeams: 1,
                basePrice: resourceData[id].base,
                marketPrice: calculateMarketPrice(resourceData[id].base, 1),
                marketHistory: [resourceData[id].base, calculateMarketPrice(resourceData[id].base, 1)],
            })
        } else {
            marketData.currentTeams++;
            marketData.marketPrice = calculateMarketPrice(marketData.basePrice, marketData.currentTeams);
            marketData.marketHistory.push(marketData.marketPrice);
            await marketData.save();
        }

        for (const market of allMarketData) {
            if (market.elementId !== id) {
            if (!market.marketHistory) {
                market.marketHistory = [resourceData[market.elementId].base];
            }
            
            // Append the current price to the history
            market.marketHistory.push(market.marketPrice);
            await market.save();
            }
        }

        return NextResponse.json(
            { success: true, message: "Element purchased successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error processing purchase:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
