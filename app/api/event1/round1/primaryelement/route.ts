// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/dbConnect";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { Users } from "@/models/user.model";
// import TeamModelRound1 from "@/models/event1/event1Round1Team.model"; // Adjust the import path as needed
// import MarketModel from "@/models/event1/CommonInfo.model";
// import resourceData from '@/constant/round1/element.json'
// import calculateMarketPrice from "@/utils/calculateMarketPrice";

// export async function POST(request: Request): Promise<NextResponse> {
//     await dbConnect();

//     try {
//         console.log('Request received');
//         const session = await getServerSession(authOptions);
//         const sessionUser = session?.user;

//         if (!sessionUser) {
//             return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
//         }

//         const user = await Users.findOne({ email: sessionUser.email });
//         if (!user) {
//             return NextResponse.json({ message: "User not found" }, { status: 404 });
//         }

//         console.log('User found:', user);

    
//         const team = await TeamModelRound1.findOne({teamLeaderEmail: user.email});
//         console.log('Team found:', team);

//         if (!team) {
//             return NextResponse.json({ message: "Team not found" }, { status: 404 });
//         }

//         if (user.event1TeamRole) {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }

//         const body = await request.json();
//         console.log('Request body:', body);

//         const id = body?.elementId;
//         console.log('dsa',isNaN(id));
//         const rate = body?.elementRate;
//         console.log('dfads',rate);
//         // const {elementId,elementRate} = await request.json();

//         if (team.primaryElement !== -1 && team.primaryRate !== -1){
//             return NextResponse.json({message: "Cannot purchase again"}, {status: 410});
//         }
//         if (isNaN(id) || !rate) {
//             return NextResponse.json({ message: "id and rate are required" }, { status: 400 });
//         }
//         if (typeof id !== "number" || typeof rate !== "number") {
//             console.error("Invalid id or rate:", id, rate);
//             return NextResponse.json({ message: "Invalid data format" }, { status: 402 });
//         }
        

//         team.primaryElement = id;
//         team.primaryRate = rate;
//         await team.save();

//         const marketData = await MarketModel.findOne({ elementId: id });
//         if (!marketData) {
//             await MarketModel.create({
//                 elementId: id,
//                 currentTeams: 1,
//                 basePrice: resourceData[id].base,
//                 marketPrice: calculateMarketPrice(resourceData[id].base, 1),
//             })
//         } else {
//             marketData.currentTeams++;
//             marketData.marketPrice = calculateMarketPrice(marketData.basePrice, marketData.currentTeams);
//             await marketData.save();
//         }

//         return NextResponse.json(
//             { success: true, message: "Element purchased successfully" },
//             { status: 200 }
//         );

//     } catch (error) {
//         console.error("Error processing purchase:", error);
//         return NextResponse.json(
//             { success: false, message: "Internal Server Error"},
//             { status: 500 }
//         );
//     }
// }

//TODO: (1) handle the change in wallet amount

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

        if (team.primaryElement || team.primaryRate) {
            console.log("Team has already purchased an element");
            return NextResponse.json({ message: "Cannot purchase again" }, { status: 410 });
        }

        if (isNaN(id) || isNaN(rate)) {
            console.log("Invalid ID or Rate:", id, rate);
            return NextResponse.json({ message: "id and rate are required" }, { status: 400 });
        }

        team.primaryElement = id;
        team.primaryRate = rate;

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
