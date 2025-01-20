import { dbConnect } from "@/lib/dbConnect";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(): Promise<NextResponse> {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userDetails = {
      email: user.email,
      name: user.name,
      regNo: user?.regNo,
      mobNo: user?.mobNo,
      hasFilledDetails: user?.hasFilledDetails,
      events: user?.events,
    }

    return NextResponse.json({ success: true, message: "Fetched user details", user: userDetails }, { status: 200 });
  } catch (error: unknown) {
    if ( error instanceof Error) {
      console.error("Error fetching user details:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch user details", error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching user details:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch user details", error: "Internal server error" }, { status: 500 });
    }
  }
}