import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import islandResourcesModel from "@/models/event1/islandResources.model";

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

    // Fetch data based on teamLeaderEmail
    const islandData = await islandResourcesModel.find({ teamLeaderEmail: user.email }).select("islandNumber resourcesAvailable").lean();
    
    if (!islandData || islandData.length === 0) {
      return NextResponse.json({ message: "No data found for this team leader" }, { status: 404 });
    }

    // Remove _id field from the response
    const filteredData = islandData.map(({ _id, ...rest }) => rest);

    return NextResponse.json({
      message: "Data fetched successfully",
      data: filteredData,
    }, { status: 200 });
  
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}