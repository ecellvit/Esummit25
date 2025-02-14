import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/pionera/user.model";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Get the current session from NextAuth
    const session = await getServerSession(authOptions);

    // If there's no session, respond with an unauthorized status
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Parse the incoming request body to get the user details for registration
    const {
      name,
      email,
      startupName,
      mobileNumber,
      driveLink,
      collegeName,
    }: {
      name: string;
      email: string;
      startupName: string;
      mobileNumber: string;
      driveLink: string;
      collegeName: string;
    } = await request.json();

    // Log the request data for debugging
    console.log("Received Registration Data:", {
      name,
      email,
      startupName,
      mobileNumber,
      driveLink,
      collegeName,
    });

    // Validate required fields
    if (
      !name ||
      !email ||
      !startupName ||
      !mobileNumber ||
      !driveLink ||
      !collegeName
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if a user with the same email already exists
    const existingEmail = await Users.findOne({ email }).lean();
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email is already registered." },
        { status: 409 }
      );
    }

    // Check if a user with the same mobile number already exists
    const existingMobile = await Users.findOne({ mobileNumber }).lean();
    if (existingMobile) {
      return NextResponse.json(
        { success: false, message: "Mobile number is already registered." },
        { status: 409 }
      );
    }

    // Log that we're going to create the user
    console.log("Creating new user");

    // Create a new user using the provided details, omitting `regNo`
    const newUser = new Users({
      name,
      email,
      startupName,
      mobileNumber,
      driveLink,
      collegeName,
    });

    // Log the newUser data to ensure it does not contain regNo
    console.log("New User Object Before Saving:", newUser);

    // Save the new user
    await newUser.save();

    // Log the success after saving
    console.log("User saved successfully:", newUser);

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
