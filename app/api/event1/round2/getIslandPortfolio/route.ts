import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import IslandResources from "@/models/event1/islandResources.model";


export async function GET(request: Request): Promise<NextResponse> {
    await dbConnect();
  
    try {
      console.log("hello");
      const session = await getServerSession(authOptions);
      const sessionUser = session?.user;
  
      if (!session || !sessionUser) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
      }
  
      const url = new URL(request.url);
      const islandNumber = url.searchParams.get("islandNumber");
      console.log(url);
  
      if (!islandNumber) {
        return NextResponse.json({ message: "Island number is required" }, { status: 400 });
      }
  
      const user = await Users.findOne({ email: sessionUser.email });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      if (user.event1TeamRole !== 0) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      // Fetch island data by matching both teamLeaderEmail and islandNumber
      const islandData = await IslandResources.findOne({
        islandNumber: parseInt(islandNumber),
        teamLeaderEmail: user.email, // Matching team leader email with user's email
      });
  
      if (!islandData) {
        return NextResponse.json({ message: "Island not found or unauthorized access" }, { status: 404 });
      }
  
      return NextResponse.json({
        message: "Success",
        portfolio: islandData.portfolio || [0, 0, 0, 0, 0],
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }
  