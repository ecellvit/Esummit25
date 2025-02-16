import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users as PioneiraUsers } from "@/models/pioneira/user.model";
import type { NextRequest } from "next/server";
import validator from "validator";
import { Users } from "@/models/user.model";

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
      email: session.user.email,
      startupEmail: oldUser.email,
      startupName: oldUser.startupName,
      primaryMobileNumber: oldUser.primaryMobileNumber,
      alternateMobileNumber: oldUser.alternateMobileNumber,
      websiteLink: oldUser.websiteLink,
      educationalInstitution: oldUser.educationalInstitution,
      startupStage: oldUser.startupStage,
      technologyReadinessLevel: oldUser.trlLevel,
      portfolioLink: oldUser.driveLink,
      hasFilledDetails: true,
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
    const duplicateUserStartupEmail = await PioneiraUsers.findOne({ startupEmail: user.startupEmail, hasFilledDetails: true }).lean();
    if (duplicateUserStartupEmail) {
      return NextResponse.json(
        { success: false, message: "Email is already registered." },
        { status: 409 }
      );
    }

    // ✅ Check if Primary Mobile Number is Already Registered
    const existingMobileUser = await PioneiraUsers.findOne({
      primaryMobileNumber: user.primaryMobileNumber,
      hasFilledDetails: true
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

    const existingUser = await PioneiraUsers.findOne({ email: session.user.email });
    if (existingUser) {
      if (existingUser.hasFilledDetails) {
        return NextResponse.json(
          { success: false, message: "You have already filled the form." },
          { status: 410 }
        );
      } else {
        existingUser.founderName = user.founderName;
        existingUser.startupEmail = user.startupEmail;
        existingUser.startupName = user.startupName;
        existingUser.primaryMobileNumber = user.primaryMobileNumber;
        existingUser.alternateMobileNumber = user.alternateMobileNumber;
        existingUser.websiteLink = user.websiteLink;
        existingUser.educationalInstitution = user.educationalInstitution;
        existingUser.startupStage = user.startupStage;
        existingUser.technologyReadinessLevel = user.technologyReadinessLevel;
        existingUser.portfolioLink = user.portfolioLink;
        existingUser.hasFilledDetails = true;

        const existingSessionUser = await Users.findOne({ email: session.user.email });
        if (existingSessionUser) {
          existingSessionUser.hasFilledDetails = true;
          await existingSessionUser.save();
        }
        
        await existingUser.save();
        console.log("User updated successfully:", existingUser);
        return NextResponse.json(
          { success: true, message: "User registered successfully", user: existingUser },
          { status: 201 }
        );
      }
    }
    
    const existingSessionUser = await Users.findOne({ email: session.user.email });
    if (existingSessionUser) {
      existingSessionUser.hasFilledDetails = true;
      await existingSessionUser.save();
    }
    console.log("Creating new user...");

    // ✅ Create a new user
    const newUser = new PioneiraUsers(user);
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
