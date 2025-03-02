import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import MarketModel from "@/models/event1/CommonInfo.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import resourceData from '@/constant/round1/element.json'
import calculateMarketPrice from "@/utils/calculateMarketPrice";
import { ApiResponse } from "@/types/ApiResponse";
import CurrentPageModel from "@/models/event1/currentPage.model";

export async function PUT(req: Request): Promise<NextResponse<ApiResponse>> {
    await dbConnect()

    try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) {
        return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    if (!sessionUser.events || !sessionUser.events.includes(1)) {
        return NextResponse.json({ success: false, message: "User is not participating in event 1" }, { status: 403 });
    }

    if (sessionUser.event1TeamRole !== 0) {
        return NextResponse.json({ success: false, message: "User is not a team leader" }, { status: 403 });
    }

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: sessionUser.email });
    if (!team) {
        return NextResponse.json({ success: false, message: "You are not qualified for this event" }, { status: 403 });
    }

    const { leaseElement, leaseRate, cost } = await req.json();
    if (!(leaseElement >= 0 && leaseElement <= 4) ||!leaseRate || !cost) {
        return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const currentPage = await CurrentPageModel.findOne({ creator: true });
    if (!currentPage) {
      return NextResponse.json({ success: false, message: "Current page not found" }, { status: 404 });
    }

    const startTime = new Date(currentPage.startedAt).getTime();
    const currentTime = Date.now();

    const timePassed = Math.floor((currentTime - startTime) / 1000);

    if (currentPage.round !== 1 || currentPage.page !== 3) {
      return NextResponse.json({ success: false, message: "This round is over." }, { status: 403 });
    }

    if (currentPage.round === 1 && currentPage.page === 3 && timePassed > 5 * 60) {
      return NextResponse.json({ success: false, message: "Time limit for this round has passed" }, { status: 403 });
    }

    if (team.wallet < cost) {
        return NextResponse.json({ success: false, message: "Insufficient funds in wallet" }, { status: 403 });
    }

    if (team.primaryElement === leaseElement) {
        return NextResponse.json({ success: false, message: "You have bought the same element as the primary element" }, { status: 400 });
    }

    if (team.secondaryElement === leaseElement) {
        return NextResponse.json({ success: false, message: "You have bought the same element as the secondary element" }, { status: 400 });
    }

    if (team.lease2Element) {
        return NextResponse.json({ success: false, message: "You have already leased an element" }, { status: 400 });
    }

    //? Update the team's lease1 details and wallet
    team.wallet -= cost;
    team.lease2Element = leaseElement;
    team.lease2Rate = leaseRate;
    team.lease2StartTime = new Date();
    
    // Get all market data records to update histories
    const allMarketData = await MarketModel.find({});

    //? Update the market data if it exists, or create a new market data for that element
    const marketData = await MarketModel.findOne({ elementId: leaseElement });
    if (!marketData) {
        await MarketModel.create({
        elementId: leaseElement,
        currentTeams: 1,
        basePrice: resourceData[leaseElement].base,
        marketPrice: calculateMarketPrice(resourceData[leaseElement].base, 1),
        marketHistory: [resourceData[leaseElement].base, calculateMarketPrice(resourceData[leaseElement].base, 1)],
        })
    } else {
        marketData.currentTeams++;
        marketData.marketPrice = calculateMarketPrice(marketData.basePrice, marketData.currentTeams);
        marketData.marketHistory.push(marketData.marketPrice);
        await marketData.save();
    }
    
    for (const market of allMarketData) {
        if (market.elementId !== leaseElement) {
            if (!market.marketHistory) {
            market.marketHistory = [resourceData[market.elementId].base];
            }
            
            // Append the current price to the history
            market.marketHistory.push(market.marketPrice);
            await market.save();
        }
    }
      
    //? Delay updating the team details until the market has been updated
    await team.save();

    return NextResponse.json({ success: true, message: "Team lease updated successfully" }, { status: 200 });

    } catch (error: unknown) {
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
    }
}