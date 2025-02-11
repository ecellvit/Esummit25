import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { Users } from "@/models/pionera/user.model";
import type { NextRequest } from "next/server";
import { log } from "console";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Get the current session from NextAuth
    const session = await getServerSession(authOptions);
    console.log(session);
    // If there's no session, respond with an unauthorized status
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Ensure that the session contains the required user details
    const { user } = session;
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, message: "User session is missing email." },
        { status: 400 }
      );
    }

    // Parse the incoming request body to get the user details for registration
    const {
      startupName,
      mobileNumber,
      driveLink,
      collegeName,
    }: {
      startupName: string;
      mobileNumber: number;
      driveLink: string;
      collegeName: string;
    } = await request.json();
    console.log(startupName, mobileNumber, driveLink, collegeName);
    // Validate required fields
    if (!startupName || !mobileNumber || !driveLink || !collegeName) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Users.findOne({ email: user.email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already registered" },
        { status: 409 }
      );
    }

    // Create a new user using the provided details
    const newUser = new Users({
      name: user.name, // Use name from session
      email: user.email, // Use email from session
      startupName,
      mobileNumber,
      driveLink,
      collegeName,
    });

    await newUser.save();

    // Return a success response with the created user details
    return NextResponse.json(
      { success: true, message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error registering user:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
