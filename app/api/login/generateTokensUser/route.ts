import { UserToken } from "@/models/usertoken";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface User {
  _id: Types.ObjectId;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export async function generateTokens(user: User): Promise<Tokens> {
  try {
    const payload = {
      _id: user._id,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "", {
      expiresIn: "5d",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || "", {
      expiresIn: "30d",
    });

    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    }

    await new UserToken({ userId: user._id, token: refreshToken }).save();

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
}
