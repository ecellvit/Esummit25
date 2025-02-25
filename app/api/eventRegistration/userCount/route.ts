import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Users } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  await dbConnect(); // Connect to the database

  try {
    const event1Registrations = await Users.countDocuments({ events: 1 });
    const event2Registrations = await Users.countDocuments({ events: 2 });
    const event3Registrations = await Users.countDocuments({ events: 3 });
    const event4Registrations = await Users.countDocuments({ events: 4 });
    const event5Registrations = await Users.countDocuments({ events: 5 });

    const registrations = [ event1Registrations, event2Registrations, event3Registrations, event4Registrations, event5Registrations ];
    
    return NextResponse.json({ success: true, message: "Fetched Data", data: registrations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}