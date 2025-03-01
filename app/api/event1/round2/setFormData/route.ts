import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model"; // Adjust the import path as needed
import TeamModelRound1,{round1Qualified} from "@/models/event1/event1Round1Team.model";
import IslandRound2,{round2Island} from "@/models/event1/round2Island.model";
import mongoose, { Types } from "mongoose";



export async function POST(request: Request): Promise<NextResponse> {
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
            return NextResponse.json({ message: "Team not compelted round 1" }, { status: 404 });
        }

        if (user.event1TeamRole !== 0) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const {islandData,insurance}= await request.json();
        console.log(islandData,insurance);
        const islands = ['island1','island2','island3','island4'];
        const batchArray: (mongoose.Schema.Types.ObjectId | null)[] = Array(4).fill(null);
        const indexes = Object.keys(islandData).map(island => islands.indexOf(island));

        console.log(indexes);
        let trans;
        for(let i=0;i<indexes.length;i++){
            const island = islandData[islands[indexes[i]]];
            console.log('island ka data',island);
            const elementQuantity=[0,0,0,0,0];
            var totalQuantity = 0;
            for(let j=0;j<island.length;j++){
                elementQuantity[j]+=island[j].quantity;
                totalQuantity += island[j].quantity;
                if(island[j].transport=='Air'){
                    trans=0;
                }else{
                    trans = 1;
                }
            }
            const batchData : round2Island = new IslandRound2({
                teamLeaderId:user._id,
                teamLeaderEmail: user.email,
                modeOfTransport:trans,
                elementQuantity,
                totalQuantity:totalQuantity,
                startTime:Date.now()
            })
            await batchData.save();
            console.log('this is the batch data',batchData);
            let idx = indexes[i];
            batchArray[idx] = batchData._id as mongoose.Schema.Types.ObjectId;


        }
        team.islandBatch1 = batchArray;
        team.insuranceType.push(insurance) ;
        team.batch++;
        await team.save();
        // const elementQuantity=[0,0,0,0];
        // for(let i=0;i<entries.length;i++){
        //     elementQuantity[entries[i].element] += entries[i].quantity; // ✅ Fix indexing

        // }
        // let trans=2;
        // if(entries[0].transport=='Air'){
        //     trans=1;
        // }
        // const batchData=new TeamModelRound2({
        //     teamLeaderId:user._id,
        //     teamLeaderEmail:user.email,
        //     modeOfTransport:trans,
        //     elementQuantity:elementQuantity
        // })
        // await batchData.save();
        
        


        return NextResponse.json({ success: true, message: "successfull" }, { status: 200 });

    }
    catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error saving batchData:", error.message);  // ✅ Log actual error message
            return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
        } else {
            console.error("Unknown error:", error);  // ✅ Handle unexpected error types
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }
}






