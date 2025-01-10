import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect"; // Adjust path as needed for database connection
import { IUser } from "../../../../models/user.model"; // Adjust paths based on your project structure
import { Team } from "../../../../models/event1/Team.model"; // Adjust paths based on your project structure

interface JoinTeamRequest extends NextApiRequest {
  body: {
    userId: string; // User ID as a string
    teamCode: string; // Team code to identify the team
  };
}

export default async function handler(
  req: JoinTeamRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    await dbConnect(); // Ensure database is connected

    const { userId, teamCode } = req.body;

    // Validate input
    if (!userId || !teamCode) {
      return res
        .status(400)
        .json({ message: "User ID and Team Code are required." });
    }

    // Find the team by team code
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Find the user by user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already part of the team
    const isAlreadyMember = team.teamMembers.some(
      (member: { userId: mongoose.Types.ObjectId; role: number }) =>
        member.userId.equals(user._id)
    );
    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "You are already part of this team." });
    }

    // Add the user to the team with role = 1 (team member)
    team.teamMembers.push({
      userId: user._id,
      role: 1, // Team member
    });
    await team.save();

    // Update the user's team information
    user.event1TeamId = team._id;
    user.event1TeamRole = 1; // Set user role to member
    await user.save();

    return res.status(200).json({ message: "Successfully joined the team." });
  } catch (error) {
    console.error("Error joining team:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}