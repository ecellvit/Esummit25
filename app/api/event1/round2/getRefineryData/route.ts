import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import islandResourcesModel from "@/models/event1/islandResources.model";

interface IslandData {
  islandNumber: number;
  resourcesAvailable: number[];
}

export async function GET(request: Request): Promise<NextResponse> {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!sessionUser) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.event1TeamRole !== 0) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let allIslandData: IslandData[] = [];

    for (let i = 0; i <= 3; i++) {
      const islandData = await islandResourcesModel.find({ islandNumber: i });
      if (islandData && islandData.length > 0) {
        const elementQuantities = islandData.map((island) => ({
          islandNumber: island.islandNumber,
          resourcesAvailable: island.resourcesAvailable,
        }));
        allIslandData = allIslandData.concat(elementQuantities);
      }
    }

    if (allIslandData.length === 0) {
      return NextResponse.json({ message: "No data found for any islands" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Data fetched successfully",
      data: allIslandData,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}