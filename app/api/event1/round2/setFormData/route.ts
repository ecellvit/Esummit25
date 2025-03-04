import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import MarketModel from "@/models/event1/CommonInfo.model"; // Adjust the import path as needed
import TeamModelRound1, { round1Qualified } from "@/models/event1/event1Round1Team.model";
import IslandRound2, { round2Island } from "@/models/event1/round2Island.model";
import mongoose, { Types } from "mongoose";
import insuranceData from "@/constant/round2/insurance.json";

export async function POST(request: Request): Promise<NextResponse> {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    if (!session || !sessionUser) {
      return NextResponse.json(
        { message: "User  not authenticated" },
        { status: 401 }
      );
    }
    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ message: "User  not found" }, { status: 404 });
    }

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
    if (!team) {
      return NextResponse.json(
        { message: "Team not compelted round 1" },
        { status: 404 }
      );
    }

    if (user.event1TeamRole !== 0) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    var batchNumber: number = team.batch;

    if (batchNumber >= 4) {
      return NextResponse.json(
        { message: "Only 3 batches are allowed" },
        { status: 450 }
      );
    }

    const { islandData, insurance } = await request.json();
    console.log(islandData, insurance);
    const islands = ["island1", "island2", "island3", "island4"];
    const batchArray: (mongoose.Schema.Types.ObjectId | null)[] =
      Array(4).fill(null);
    const indexes = Object.keys(islandData).map((island) =>
      islands.indexOf(island)
    );

    if(insurance<0 || insurance>3){
      return NextResponse.json({ message: "Insurance value should be between 0 and 3"},{status:401})
    }

    const selectedInsurance = insuranceData[insurance];
    if (!selectedInsurance) {
      return NextResponse.json(
        { message: "Invalid insurance option" },
        { status: 400 }
      );
    }
    const insuranceCost = selectedInsurance.cost_per_batch;
    if (team.wallet < insuranceCost) {
      return NextResponse.json(
        { message: "Insufficient funds for selected insurance" },
        { status: 402 }
      );
    }

    console.log(indexes);

    let trans;
    for (let i = 0; i < indexes.length; i++) {
      const island = islandData[islands[indexes[i]]];

      if (!island || island.length === 0) {
        console.log(`Skipping island ${indexes[i]} because it has no entries`);
        continue; // Skip to the next iteration of the loop
      }
      const elementQuantity = [0, 0, 0, 0, 0];
      var totalQuantity = 0;
      for (let j = 0; j < island.length; j++) {
        elementQuantity[parseInt(island[j].element,10)] += island[j].quantity;
        totalQuantity += island[j].quantity;
        if (island[j].transport == "Air") {
          trans = 0;
        } else {
          trans = 1;
        }
      }

      if (totalQuantity > 200)
        return NextResponse.json(
          { message: `quantity limit exceeded for batch${batchNumber}` },
          { status: 410 }
        );
      const batchData: round2Island = new IslandRound2({
        teamLeaderId: user._id,
        teamLeaderEmail: user.email,
        modeOfTransport: trans,
        elementQuantity,
        totalQuantity: totalQuantity,
        batch:batchNumber,
        insurance:insurance,
        startTime: Date.now(),
        island:indexes[i],
      });
      await batchData.save();
      console.log("this is the batch data", batchData);
      let idx = indexes[i];
      batchArray[idx] = batchData._id as mongoose.Schema.Types.ObjectId;
    }
    if (batchNumber === 1) {
      team.islandBatch1 = batchArray;
    } else if (batchNumber === 2) {
      team.islandBatch2 = batchArray;
    } else if (batchNumber === 3) {
      team.islandBatch3 = batchArray;
    }

    // batchArray.forEach((batchId, index) => {
    //   if (!batchId) return; // Skip if batchId is null

    //   const island = islandData[islands[index]];
    //   island.forEach((entry: { element: number; quantity: number }) => {
    //     if (team.portfolio[entry.element] !== undefined) {
    //       team.portfolio[entry.element] = Math.max(
    //         0,
    //         team.portfolio[entry.element] - entry.quantity
    //       );
    //     }
    //   });
    // });

    // batchNumber++;
    // team.wallet -= insuranceCost;
    team.insuranceType[batchNumber-1] = insurance;
    team.batch = batchNumber;
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

    return NextResponse.json(
      { success: true, message: "successfull" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error saving batchData:", error.message); // ✅ Log actual error message
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error); // ✅ Handle unexpected error types
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
