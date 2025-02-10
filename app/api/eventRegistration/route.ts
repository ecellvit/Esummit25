import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Users } from '@/models/user.model';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;

        if (!session || !sessionUser) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        if (!sessionUser.hasFilledDetails) {
            return NextResponse.json({ message: 'Please complete your profile details first' }, { status: 402 });
        }

        const user = await Users.findOne({ email: sessionUser.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { event } = await request.json();
        const parsedNumber = parseInt(event, 10);
        if (isNaN(parsedNumber)) {
            return NextResponse.json({ error: 'Invalid number parameter' }, { status: 400 });
        }

        if (parsedNumber < 1 || parsedNumber > 5) {
            return NextResponse.json({ error: 'Number must be between 1 and 6' }, { status: 400 });
        }

        if (parsedNumber === 5 && user.email.endsWith("@vitstudent.ac.in")) {
            return NextResponse.json({ error: "VIT students can't register for this event" }, { status: 403 });
        }

        if (user.events.includes(parsedNumber)) {
            return NextResponse.json({ message: "Already registered for the event." }, { status: 407 });
        }

        user.events.push(parsedNumber);
        await user.save();

        return NextResponse.json({ message: "Successfully Registered for Event", status: 200 });
    } catch (error) {
        console.error('Error updating user events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
