import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import CurrentPageModel from "@/models/event1/currentPage.model";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        const upgrades = [
            { id: 1, name: "Mining Efficiency", cost: 5000, description: "Increases mining output" },
            { id: 2, name: "Workforce Management", cost: 6000, description: "Improves worker productivity" },
            { id: 3, name: "Machinery Upgradation", cost: 4000, description: "Enhances machinery performance" }
        ];

        console.log("Request received");

        // Authenticate user
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;
        if (!sessionUser) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        // Find user in DB
        const user = await Users.findOne({ email: sessionUser.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log("User found:", user);

        // Get team details
        const team = await TeamModelRound1.findOne({teamLeaderEmail: user.email});
        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        console.log("Team found:", team);

        // Ensure user has permission
        if (user.event1TeamRole) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (team.hasUpgraded) {
            return NextResponse.json({ message: "Upgrade already used. Cannot upgrade again." }, { status: 403 });
        }

        const currentPage = await CurrentPageModel.findOne({ creator: true });
        if (!currentPage) {
          return NextResponse.json({ success: false, message: "Current page not found" }, { status: 404 });
        }
    
        const startTime = new Date(currentPage.startedAt).getTime();
        const currentTime = Date.now();
    
        const timePassed = Math.floor((currentTime - startTime) / 1000);
    
        if (currentPage.round !== 1 || currentPage.page !== 3) {
          return NextResponse.json({ success: false, message: "This round is over." }, { status: 403 });
        }
    
        if (currentPage.round === 1 && currentPage.page === 3 && timePassed > 5 * 60) {
          return NextResponse.json({ success: false, message: "Time limit for this round has passed" }, { status: 403 });
        }    

        // Parse request body
        const body = await request.json();
        const { upgradeLevel } = body;
        if (![1, 2, 3].includes(upgradeLevel)) {
            return NextResponse.json({ message: "Invalid upgrade level" }, { status: 400 });
        }

        // Fetch primaryElement from team data
        const { primaryElement } = team;
        if (primaryElement === undefined) {
            return NextResponse.json({ message: "Primary element not set" }, { status: 400 });
        }

        console.log("Primary Element:", primaryElement);

        // Define increments based on primaryElement
        const incrementMap: Record<number, number[]> = {
            0: [4, 5, 6],
            1: [5, 2, 3],
            2: [1, 5, 3],
            3: [4, 2, 0],
            4: [2, 6, 5]
        };

        if (!(primaryElement in incrementMap)) {
            return NextResponse.json({ message: "Invalid primary element" }, { status: 400 });
        }

        // Get increment value based on upgradeLevel
        const increment = incrementMap[primaryElement][upgradeLevel - 1];

        const selectedUpgrade = upgrades.find((upgrade) => upgrade.id === upgradeLevel);
        if (!selectedUpgrade) {
            return NextResponse.json({ message: "Invalid upgrade selected" }, { status: 400 });
        }
        const cost = selectedUpgrade.cost;
        if (team.wallet < cost) {
            return NextResponse.json({ message: "Insufficient funds" }, { status: 403 });
        }

        // Update primaryRate
        team.primaryRate += increment;
        team.wallet = team.wallet-cost;
        team.hasUpgraded = true; 
        await team.save();

        console.log(`Upgrade applied: Level ${upgradeLevel}, Increment ${increment}, New Rate: ${team.primaryRate} Wallet: ${team.wallet}`);

        return NextResponse.json({ newRate: team.primaryRate }, { status: 200 });


    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal Server error", error }, { status: 500 });
    }
}
