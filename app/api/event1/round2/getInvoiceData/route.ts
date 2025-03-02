import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import { round2Island } from "@/models/event1/round2Island.model";
import IslandRound2 from "@/models/event1/round2Island.model";

type Custom = {
    destination: number;
    cost:number ;
    transport: number;
    elements: number[];
}

export async function GET(request: Request): Promise<NextResponse> {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const sessionUser  = session?.user;
        if (!sessionUser ) {
            return NextResponse.json({ message: "User  not authenticated" }, { status: 401 });
        }
        const user = await Users.findOne({ email: sessionUser .email });
        if (!user) {
            return NextResponse.json({ message: "User  not found" }, { status: 404 });
        }
        const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        if (user.event1TeamRole !== 0) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const batch1 = team.islandBatch1;
        const batch2 = team.islandBatch2;
        const batch3 = team.islandBatch3;
        const totalBatch1 : (Custom | null)[] = [];
        const totalBatch2 : (Custom | null)[] = [];
        const totalBatch3 : (Custom | null)[] = [];

        for(let i=0;i<batch1.length;i++){
            if(batch1[i]){
                const island = await IslandRound2.findOne({ _id: batch1[i] });
                const data: Custom={
                    destination: i,
                    cost: island?.totalQuantity ?? 0,
                    transport: island?.modeOfTransport ?? -1,
                    elements: island?.elementQuantity ?? [],
                }

                totalBatch1.push(data);
            }
        }

        for(let i=0;i<batch2.length;i++){
            if(batch2[i]){
                const island = await IslandRound2.findOne({ _id: batch2[i] });
                const data: Custom={
                    destination: i,
                    cost: island?.totalQuantity ?? 0,
                    transport: island?.modeOfTransport ?? -1,
                    elements: island?.elementQuantity ?? [],
                }

                totalBatch2.push(data);
            }
        }

        for(let i=0;i<batch1.length;i++){
            if(batch3[i]){
                const island = await IslandRound2.findOne({ _id: batch3[i] });
                const data: Custom={
                    destination: i,
                    cost: island?.totalQuantity ?? 0,
                    transport: island?.modeOfTransport  ?? -1,
                    elements: island?.elementQuantity ?? [],
                }

                totalBatch3.push(data);
            }
        }

        var num = 0;
        if(team.batch===2) num = 1;
        else if(team.batch === 3) num = 2;
        else if(team.batch === 4) num = 3;
        else{
            console.log("Invalid batch number",team.batch);
            return NextResponse.json({message:"invalid batch number"},{status:407})
        }
        // Return the portfolio as teamElements
        const teamElements = team.portfolio; // Assuming portfolio is an object with element names as keys
        const batchNumber = num; // 1, 2, or 3
        const batchKey = `islandBatch${batchNumber}`; // Create the key dynamically
        const islandBatch = (team as any)[batchKey]; // Typecasting team as 'any' to access the dynamic key
        const insuranceType = team.insuranceType[num-1] ?? -1;

        return NextResponse.json({
            message: "Data fetched successfully",
            teamElements: teamElements,
            totalBatch1,
            totalBatch2,
            totalBatch3,
            batchNumber,
            insuranceType,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
