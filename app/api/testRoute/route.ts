import { Users } from '@/models/user.model';
import TeamModel from '@/models/event1/Team.model';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import * as xlsx from 'xlsx';

export async function GET() {
    console.log("Generating Excel sheet for users in teams of size 1 and size 2");
    // Connect to the MongoDB database
    await dbConnect();
    try {
        // Step 1: Find teams with exactly 1 or 2 members
        const teams = await TeamModel.find({
            $or: [
                { teamMembers: { $size: 1 } },
                { teamMembers: { $size: 2 } }
            ]
        });

        const teamIds = teams.map(team => team._id);

        // Step 2: Find users in these teams
        const users = await Users.find({
            event1TeamId: { $in: teamIds }
        }).populate('event1TeamId');

        const userCount = users.length;
        console.log("Total users in teams of size 1 and size 2:", userCount);

        if (userCount === 0) {
            return NextResponse.json({ message: 'No users found in teams of size 1 and size 2' }, { status: 200 });
        }

        // Step 3: Separate users into two groups based on team size
        const usersInSize1Teams = users.filter(user => user.event1TeamId.teamMembers.length === 1);
        const usersInSize2Teams = users.filter(user => user.event1TeamId.teamMembers.length === 2);

        // Step 4: Prepare data for the Excel sheets
        const userDataSize1 = usersInSize1Teams.map(user => ({
            name: user.name || 'N/A',
            email: user.email || 'N/A',
            mobNo: user.mobNo ? user.mobNo.toString() : 'N/A',
            regNo: user.regNo || 'N/A',
            teamName: user.event1TeamId?.teamName || 'N/A',
            event1TeamRole: user.event1TeamRole !== undefined ? (user.event1TeamRole === 0 ? 'Leader' : 'Member') : 'N/A'
        }));

        const userDataSize2 = usersInSize2Teams.map(user => ({
            name: user.name || 'N/A',
            email: user.email || 'N/A',
            mobNo: user.mobNo ? user.mobNo.toString() : 'N/A',
            regNo: user.regNo || 'N/A',
            teamName: user.event1TeamId?.teamName || 'N/A',
            event1TeamRole: user.event1TeamRole !== undefined ? (user.event1TeamRole === 0 ? 'Leader' : 'Member') : 'N/A'
        }));

        // Step 5: Create a new workbook and add sheets with user data
        const wb = xlsx.utils.book_new();
        const wsSize1 = xlsx.utils.json_to_sheet(userDataSize1);
        const wsSize2 = xlsx.utils.json_to_sheet(userDataSize2);
        xlsx.utils.book_append_sheet(wb, wsSize1, 'Teams of Size 1');
        xlsx.utils.book_append_sheet(wb, wsSize2, 'Teams of Size 2');

        // Step 6: Create a buffer from the workbook for file download
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Step 7: Set the headers and send the response
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="users_in_teams_of_size_1_and_2.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });

    } catch (error) {
        console.error("Error while generating Excel sheet:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}



