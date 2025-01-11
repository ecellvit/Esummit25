import { NextResponse } from 'next/server';
import { Users } from '@/models/user.model';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is missing' }, { status: 400 });
        }

        let user = await Users.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        user.event1Consent = true;
        await user.save();

        return NextResponse.json({ message: "Successfully changed the consent", status: 200 });

    } catch (error) {
        console.error('Error during request handling:', error);
        return NextResponse.json({ error: 'Request handling error' }, { status: 500 });
    }
}
