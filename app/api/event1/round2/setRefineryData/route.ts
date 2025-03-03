import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import islandResourcesModel from "@/models/event1/islandResources.model";
import refineryData from "@/constant/round2/refineryData.json";
import Round1Qualified from "@/models/event1/event1Round1Team.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";


export async function GET(request: Request): Promise<NextResponse> {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!sessionUser) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const url = new URL(request.url);
    const islandNumber = url.searchParams.get("islandNumber");
    const refineryType = url.searchParams.get("refineryData");
    console.log(url,islandNumber,refineryType);

    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.event1TeamRole !== 0) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const islandData = await islandResourcesModel
      .find({ teamLeaderEmail: user.email, islandNumber: islandNumber })
      .select("islandNumber resourcesAvailable")
      .lean();

    if (!islandData || islandData.length === 0) {
      return NextResponse.json({ message: "No data found for this island" }, { status: 404 });
    }

    let totalAmount = 0;

    islandData.forEach(({ islandNumber, resourcesAvailable }) => {
      resourcesAvailable.forEach((resource: number, index: number) => {
        const islandRefineryData = (refineryData as Record<string, any>)[islandNumber];
        if (islandRefineryData && islandRefineryData[index]) {
          const cost =
            refineryType === "setup"
              ? islandRefineryData[index]["Total Own Cost"]
              : islandRefineryData[index]["Total Local Cost"];
          totalAmount += resource * cost;
        }
      });
    });

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email }).exec();
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    if (team.wallet < totalAmount) {
      return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
    }

    
    var check;
    if(refineryType==="setup"){
      check = 0
    }else check=1
    team.wallet -= totalAmount;
    team.setup = check;
    await team.save();

    return NextResponse.json({ message: "Calculation successful", amount: totalAmount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}