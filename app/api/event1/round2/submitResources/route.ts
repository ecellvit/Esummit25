import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import islandResourcesModel from "@/models/event1/islandResources.model";
import refineryData from "@/constant/round2/refineryData.json";
import Round1Qualified from "@/models/event1/event1Round1Team.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import IslandResources from "@/models/event1/islandResources.model";

export async function GET(request: Request): Promise<NextResponse> {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!sessionUser) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const url = new URL(request.url);
    console.log(url);

    const totalPrice = parseInt(url.searchParams.get("totalPrice") || "0");
    const ids = JSON.parse(url.searchParams.get("ids") || "[]");
    const islandNumber = parseInt(url.searchParams.get("islandNumber") || "0");

    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.event1TeamRole !== 0) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email });
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    team.wallet += totalPrice;
    await team.save();

    const islandResource = await IslandResources.findOne({ teamLeaderEmail: user.email, islandNumber: islandNumber });
    if (!islandResource) {
      return NextResponse.json({ message: "Island resources not found" }, { status: 404 });
    }

    ids.forEach((id: number) => {
      const index = id;
      const availableQuantity = islandResource.resourcesAvailable[index] || 0;
      const reduceQuantity = Math.floor(availableQuantity * 0.2);
      islandResource.resourcesAvailable[index] -= reduceQuantity;
    });

    await islandResource.save();

    return NextResponse.json({ message: "successful" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}