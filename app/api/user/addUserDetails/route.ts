import { dbConnect } from "@/lib/dbConnect";
import { Users } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/authOptions";

export async function PATCH(req: Request): Promise<NextResponse<ApiResponse>> {
  await dbConnect();

  try {
    const { name, regNo, number: mobNo } = await req.json();
    if (!name || !regNo || !mobNo) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    user.name = name;
    user.regNo = regNo;
    user.mobNo = mobNo;
    user.hasFilledDetails = true;

    await user.save();

    return NextResponse.json({ success: true, message: "Added user details" }, { status: 200 });
  } catch (error: unknown) {
    if ( error instanceof Error) {
      console.error("Error fetching user details:", error);
      return NextResponse.json({ success: false, message: "Failed to add user details", error: error.message }, { status: 500 });
    } else {
      console.error("Error fetching user details:", error);
      return NextResponse.json({ success: false, message: "Failed to add user details", error: "Internal server error" }, { status: 500 });
    }
  }
}