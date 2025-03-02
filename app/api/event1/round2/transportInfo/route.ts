import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model"; // Adjust the import path as needed
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import TeamModelRound2 from "@/models/event1/round2Island.model";
import islandData from "@/constant/round2/island.json";
import IslandRound2 from "@/models/event1/round2Island.model";
import mongoose from "mongoose";
type transport = {
    batch:number,
    mode:string,
    island:number,
    time:number,
}

export async function GET(): Promise<NextResponse> {
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

        // Return the portfolio as teamElements
        const teamElements = team.portfolio; // Assuming portfolio is an object with element names as keys

        const batchNumber = team.batch;

        if(batchNumber>=4 || batchNumber<0) return NextResponse.json({message:"Invalid batchnumber"},{status:405});
        console.log('team',team);
        var dataArray : transport[] = []
        var batchData : (mongoose.Schema.Types.ObjectId | null)[] = [];
        if(batchNumber===1) batchData = team.islandBatch1 ;
        else if(batchNumber===2) batchData = team.islandBatch2 ;
        else if(batchNumber===3) batchData = team.islandBatch3 ;
        console.log(batchData);
        for(let i=0;i<batchData.length;i++){
            if(batchData[i]){
                const islands = await IslandRound2.findOne({ _id: batchData[i] });
                const ele = islandData[i];
                var time : number;
                if(islands?.modeOfTransport===0) time = ele["air_travel_time_secs"];
                else time = ele["water_travel_time_secs"];

                const data: transport={
                    batch: batchNumber,
                    mode: islands?.modeOfTransport === 0 ? "plane" : "ship",
                    island: i+1,
                    time,
                }
                dataArray.push(data);
            }
        }


        return NextResponse.json({
            message: "Data fetched successfully",
            dataArray,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
