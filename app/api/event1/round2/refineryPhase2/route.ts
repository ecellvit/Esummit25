import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import { round2Island } from "@/models/event1/round2Island.model";
import IslandRound2 from "@/models/event1/round2Island.model";
import islandResourcesModel from "@/models/event1/islandResources.model";

type Custom = {
    destination: number;
    cost:number ;
    transport: number;
    elements: number[];
}

export async function GET(request: Request): Promise<NextResponse> {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user;
        if (!sessionUser) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }
        const user = await Users.findOne({ email: sessionUser?.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const team = await TeamModelRound1.findOne({ teamLeaderEmail: user?.email });
        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        if (user.event1TeamRole !== 0) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const islandEntries = await IslandRound2.find({ teamLeaderId: user._id });

        const islandMap = new Map();
        
        islandEntries.forEach(entry => {
            const island = entry.island;
            if (!islandMap.has(island)) {
                islandMap.set(island, Array(entry.elementQuantity.length).fill(0));
            }

            entry.elementQuantity.forEach((qty, index) => {
                islandMap.get(island)[index] += qty;
            });
        });

        // Iterate over the grouped islands and update the IslandResourceModel
        for (const [islandNumber, totalElements] of islandMap.entries()) {
            let resource = await islandResourcesModel.findOne({ islandNumber, teamLeaderId: user._id });

            if (!resource) {
                resource = new islandResourcesModel({
                    islandNumber,
                    teamLeaderId: user._id,
                    teamLeaderName: user.name,
                    teamLeaderEmail: user.email,
                    resourcesAvailable: totalElements,
                    maxResources: totalElements,
                });
            } else {
                resource.resourcesAvailable = totalElements;
                resource.maxResources = totalElements;
            }

            await resource.save();
        }

        return NextResponse.json({ message: "Data updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
