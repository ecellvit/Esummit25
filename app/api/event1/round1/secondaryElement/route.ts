import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model"; // Adjust the import path as needed
import MarketModel from "@/models/event1/CommonInfo.model";
import resourceData from '@/constant/round1/element.json'
import calculateMarketPrice from "@/utils/calculateMarketPrice";
import { IdCardIcon } from "lucide-react";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        

        console.log('Request received');
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;

        if (!sessionUser) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        const user = await Users.findOne({ email: sessionUser.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log('User found:', user);

        const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
        console.log('Team found:', team);

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        if (user.event1TeamRole) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        console.log('Request body:', body);

        const id = body?.elementId;
        console.log('dsa',isNaN(id));
        const rate = body?.elementRate;
        console.log('dfads',rate);
        // const {elementId,elementRate} = await request.json();

        if (team.secondaryElement || team.secondaryRate ){
            return NextResponse.json({message: "Cannot purchase again"}, {status: 410});
        }
        
        if (isNaN(id) || !rate) {
            return NextResponse.json({ message: "id and rate are required" }, { status: 400 });
        }
        console.log("jhcjhgdcghdgcjdc",id,team.primaryElement)

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

        const marketData = await MarketModel.findOne({ elementId: id });
        if (!marketData) {
            await MarketModel.create({
                elementId: id,
                currentTeams: 1,
                basePrice: resourceData[id].base,
                marketPrice: calculateMarketPrice(resourceData[id].base, 1),
            })
        } else {
            marketData.currentTeams++;
            marketData.marketPrice = calculateMarketPrice(marketData.basePrice, marketData.currentTeams);
            await marketData.save();
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
