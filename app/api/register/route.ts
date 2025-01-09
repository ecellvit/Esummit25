import {  dbConnect } from "@/lib/dbConnect";
import { Users } from "@/models/user.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";  


interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password }: UserRequestBody = await req.json(); 

    
    const userExists = await Users.findOne({ email: email });
    
    if (!userExists) {

      const newUser = new Users({ name, email, password });

      await newUser.save();

      console.log(name);
      return NextResponse.json({ message: "User registered", status: 200 });
    } else {
      return NextResponse.json({ message: "User has already registered", status: 200 });
    }

  } catch (error) {
    console.log("An error occurred:", error);
    return NextResponse.json({ message: "Error occurred while registering user", status: 500 });
  }
}
