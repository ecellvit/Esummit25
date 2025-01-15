// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/dbConnect'; // Ensure your DB connection logic
import { Users } from '@/models/user.model';

// Define Zod validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  regNo: z
    .string()
    .regex(/^\d{2}[A-Za-z]{3}\d{4}$/, 'Invalid registration number format'),
  number: z
    .string()
    .regex(/^\d{10}$/, 'Invalid phone number format'),
});

// POST method for /api/register
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }
    
    const email = authHeader.split(' ')[1];
    const formData = await req.json();

    const parsedData = registerSchema.parse(formData);
    const { name, regNo, number } = parsedData;


    await dbConnect(); 

  
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: 'User Not found' }, { status: 409 });
    }
    if(existingUser.hasFilledDetails){
      return NextResponse.json({ message: 'form already filled' },{status: 410});
    }
    existingUser.name=name;
    existingUser.regNo=regNo;
    existingUser.mobNo=number;
    existingUser.hasFilledDetails=true;
    existingUser.save();
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
