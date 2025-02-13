import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Users } from '@/models/user.model';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;

        if (!session || !sessionUser) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        if (!sessionUser.hasFilledDetails) {
            return NextResponse.json({ message: 'Please complete your profile details first' }, { status: 401 });
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
            return NextResponse.json({ error: 'Number must be between 1 and 5' }, { status: 400 });
        }

        if (parsedNumber === 5 && user.email.endsWith("@vitstudent.ac.in")) {
            return NextResponse.json({ error: "VIT students can't register for this event" }, { status: 403 });
        }

        // code for event 1 and 2
        if (user.events.includes(parsedNumber) && (parsedNumber === 1)) {
            // Check if the user has a team
            if (user.teamId) {
                return NextResponse.json({ message: "Please leave your team before deregistering." }, { status: 403 });
            } else {
                // User has no team, allow deregistration
                user.events = user.events.filter((e: number) => e !== parsedNumber);
                await user.save();
                return NextResponse.json({ message: "Successfully deregistered for the event." }, { status: 201 });
            }
        }

        // code for event 3, 4, and 5
        if (user.events.includes(parsedNumber)) {
            user.events = user.events.filter((e: number) => e !== parsedNumber);
            await user.save();
            return NextResponse.json({ message: "Successfully deregistered for the event." }, { status: 202 });
        }

        return NextResponse.json({ error: "User is not registered for this event" }, { status: 400 });
    } catch (error) {
        console.error('Error updating user events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}