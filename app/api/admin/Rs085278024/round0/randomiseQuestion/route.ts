import { dbConnect } from "@/lib/dbConnect";
import {Round0} from "@/models/event1/round0.model";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const qualTeams = await Round0.find();
    if (!qualTeams || qualTeams.length === 0) {
      return NextResponse.json(
        { message: "Team not found" },
        { status: 400 }
      );
    }

    for (let i = 0; i < qualTeams.length; i++) {
      const easy: number[] = [];
      const medium: number[] = [];
      const hard: number[] = [];

      const easyLength = 5;
      const mediumLength = 13;
      const hardLength = 7;

      const getRandomUniqueNumber = (array: number[], max: number): number => {
        let randomNumber;
        do {
          randomNumber = Math.floor(Math.random() * max) + 1;
        } while (array.includes(randomNumber));
        return randomNumber;
      };

      // Fill easy array with unique random numbers
      for (let j = 0; j < easyLength; j++) {
        easy.push(getRandomUniqueNumber(easy, 29));
      }

      // Fill medium array with unique random numbers
      for (let j = 0; j < mediumLength; j++) {
        medium.push(getRandomUniqueNumber(medium, 29));
      }

      // Fill hard array with unique random numbers
      for (let j = 0; j < hardLength; j++) {
        hard.push(getRandomUniqueNumber(hard, 24));
      }

      // Randomize arrays
      const shuffleArray = (array: number[]) => {
        for (let k = array.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [array[k], array[j]] = [array[j], array[k]];
        }
      };

      shuffleArray(easy);
      shuffleArray(medium);
      shuffleArray(hard);

      qualTeams[i].easyOrder = easy;
      qualTeams[i].mediumOrder = medium;
      qualTeams[i].hardOrder = hard;
      await qualTeams[i].save();
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
