import { NextResponse } from 'next/server';
import { Users } from '@/models/user.model';
import { dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;
        
        if (!session || !sessionUser) {
        return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
        }

        let user = await Users.findOne({ email: sessionUser.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.event1Consent) {
            return NextResponse.json({ message: "User has already given the consent", status: 200 });
        }

        user.event1Consent = true;
        await user.save();

        return NextResponse.json({ message: "Successfully changed the consent", status: 200 });

    } catch (error) {
        console.error('Error during request handling:', error);
        return NextResponse.json({ error: 'Request handling error' }, { status: 500 });
    }
}
