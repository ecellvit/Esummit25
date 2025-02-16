import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/pioneira/user.model";
import type { NextRequest } from "next/server";
import validator from "validator";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }
    console.log("Session:", session);

    await dbConnect();

    // Extract form data
    const oldUser = await request.json();
    const user = {
      founderName: oldUser.founderName,
      email: oldUser.email,
      startupEmail: oldUser.email,
      startupName: oldUser.startupName,
      primaryMobileNumber: oldUser.primaryMobileNumber,
      alternateMobileNumber: oldUser.alternateMobileNumber,
      websiteLink: oldUser.websiteLink,
      educationalInstitution: oldUser.educationalInstitution,
      startupStage: oldUser.startupStage,
      technologyReadinessLevel: oldUser.trlLevel,
      portfolioLink: oldUser.driveLink,
    };

    console.log("Received user data:", user);

    // ✅ Validate Required Fields (except websiteLink)
    const { websiteLink, ...requiredFields } = user;
    if (Object.values(requiredFields).some((field) => !field)) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // ✅ Validate Name (allow accents, hyphens, spaces)
    if (!validator.matches(user.founderName, /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Founder name must contain only letters, spaces, apostrophes, or hyphens",
        },
        { status: 400 }
      );
    }

    // ✅ Validate Email Format
    if (!validator.isEmail(user.email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ Restrict VIT student emails
    if (user.email.includes("vitstudent.ac.in")) {
      return NextResponse.json(
        { success: false, message: "Invalid email domain" },
        { status: 400 }
      );
    }

    // ✅ Validate Mobile Numbers (exactly 10 digits)
    if (
      !validator.isNumeric(String(user.primaryMobileNumber)) ||
      !validator.isNumeric(String(user.alternateMobileNumber)) ||
      String(user.primaryMobileNumber).length !== 10 ||
      String(user.alternateMobileNumber).length !== 10
    ) {
      return NextResponse.json(
        { success: false, message: "Mobile number must be exactly 10 digits" },
        { status: 400 }
      );
    }

    // ✅ Validate Website Link Format (only if provided)
    if (
      user.websiteLink &&
      !validator.isURL(user.websiteLink, { require_protocol: true })
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid website link format.Add the https://",
        },
        { status: 400 }
      );
    }

    // ✅ Check if Email is Already Registered
    const existingUser = await Users.findOne({ email: user.email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email is already registered." },
        { status: 409 }
      );
    }

    // ✅ Check if Primary Mobile Number is Already Registered
    const existingMobileUser = await Users.findOne({
      primaryMobileNumber: user.primaryMobileNumber,
    }).lean();
    if (existingMobileUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Primary mobile number is already registered.",
        },
        { status: 409 }
      );
    }

    console.log("Creating new user...");

    // ✅ Create a new user
    const newUser = new Users(user);
    await newUser.save();

    console.log("User registered successfully:", newUser);

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
