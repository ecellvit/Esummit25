import { dbConnect } from '@/lib/dbConnect';
import { Users } from '@/models/user.model';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import NextAuth, { DefaultUser, NextAuthOptions, User} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

import { UserToken } from "@/models/usertoken";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface UserT {
  _id: Types.ObjectId;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

async function generateTokens(user: UserT): Promise<Tokens> {
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


// Ensure proper type for the Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  });

// Define type for the account passed into gettokenfrombackend
interface Account {
  id_token?: string; // Made id_token optional to match next-auth's type definition
  access_token?: string; // Make access_token optional
  refresh_token?: string; // Made refresh_token optional
  expires_at?: number; // Made expires_at optional to match next-auth's type definition
}

declare module 'next-auth' {
  interface User extends DefaultUser {
    hasFilledDetails?: boolean;
    events?: number[];
    event1TeamRole?: number;
    event2TeamRole?: number;
  }
  interface Session {
    accessToken?: string;
    accessTokenBackend?: string;
    idToken?: string;
    error?: string;
    user: {
      name: string;
      email: string;
      image: string;
      hasFilledDetails?: boolean;
      events?: number[];
      event1TeamRole?: number;
      event2TeamRole?: number;
      isVitStudent?:boolean;
    }
  }
  interface Token {
    accessTokenExpires: number;
    accessToken: string;
    refreshToken: string;
    idToken: string | undefined;
    accessTokenFromBackend?: string;
    error?: string;
  }
}

const gettokenfrombackend = async (user: User, account: Account): Promise<string> => {
  await dbConnect();

  const token = account.id_token; // token can now be undefined
  if (!token) {
    throw new Error('ID token is missing');
  }

  const email = user.email!;
  const ticket: LoginTicket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const user1 = await Users.findOne({ email: email });
  const { accessToken, refreshToken } = await generateTokens(user1);
  return accessToken;
};

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { name, email } = user;
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const userExists = await Users.findOne({ email });
          if (!userExists) {
            // Create the user directly within the signIn callback
            const newUser = new Users({ name, email });
            await newUser.save();
            return true; 
          }
         

          return true; // User exists, continue the sign-in flow
        } catch (error) {
          console.error(error);
          return false; // Error occurred, sign-in is aborted
        }
      }
      return false; // Not a Google sign-in, return false
    },    
    async jwt({ token, user, account, session, trigger }) {

      if (user) {
        token.isVITStudent = user.email?.endsWith("@vitstudent.ac.in") || false;
      }
      // Type `token` explicitly to avoid 'unknown' type
      const typedToken = token as JWT & {
        accessTokenExpires?: number;
        accessToken: string;
        refreshToken: string;
        idToken: string | undefined;
        accessTokenFromBackend?: string;
        user?: {
          id: string;
          name: string; 
          email: string; 
          image?: string | null;
          hasFilledDetails?: boolean;
          events?: number[];
          event1TeamRole?: number;
          event2TeamRole?: number;
        };
      };

      if (trigger === "update" && session) {
        return {
          ...token,
          user: {
            ...(token.user as User),
            ...session.user
          }
        };
      }

      if (account && user) {
        try {
          await dbConnect();
          const existingUser = await Users.findOne({ email: user.email });
          if (existingUser) {
            return {
              ...typedToken,
              idToken: account.id_token,
              accessToken: account.access_token,
              accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
              refreshToken: account.refresh_token ?? '',
              accessTokenFromBackend: await gettokenfrombackend(user, account),
              user: {
                id: user.id,
                name: user.name,
                image: user.image,
                email: user.email,
                hasFilledDetails: existingUser.hasFilledDetails,
                events: existingUser.events,
                event1TeamRole: existingUser.event1TeamRole,
                event2TeamRole: existingUser.event2TeamRole,
              },
            };
          }
        } catch (error) {
          console.error(error);
        }
      }

      if (Date.now() < typedToken.accessTokenExpires!) {
        return typedToken;
      }

      return refreshAccessToken(typedToken);
    },

    async session({ session, token }) {
        const typedToken = token as JWT & {
          accessTokenExpires?: number;
          accessToken: string;
          refreshToken: string;
          idToken: string | undefined;
          accessTokenFromBackend?: string;
          user: {
            name?: string | null; 
            email?: string | null; 
            image?: string | null;
            hasFilledDetails?: boolean;
            events?: number[];
            event1TeamRole?: number;
            event2TeamRole?: number;
            isVitStudent:boolean;
          }
        };
      
        session.user = {
          name: typedToken.user.name ?? '',
          email: typedToken.user.email ?? '',
          image: typedToken.user.image ?? '',
          hasFilledDetails: typedToken.user.hasFilledDetails ?? false,
          events: typedToken.user.events,
          event1TeamRole: typedToken.user.event1TeamRole,
          event2TeamRole: typedToken.user.event2TeamRole,
          isVitStudent: typedToken.user.isVitStudent
        };
        session.accessToken = typedToken.accessToken;
        session.accessTokenBackend = typedToken.accessTokenFromBackend;
        session.idToken = typedToken.idToken;
      
        // Safely assign the error value as a string or undefined
        session.error = typeof typedToken.error === 'string' ? typedToken.error : undefined;
      
        // Ensure the session is always returned and not null
        if (typedToken.accessTokenFromBackend) {
          return session;  // Return the populated session if available
        }
      
        // Return a default session or an empty session if no valid token
        return {
          ...session,
          user: {
            name: null,
            email: null,
            image: null,
            hasFilledDetails: false,
            events: [],
            event1TeamRole: null,
            event2TeamRole: null,
          },
          accessToken: null,
          accessTokenBackend: null,
          error: null,
          idToken: null,
        };
      },

    async redirect() {
      return "/userDetails";
    }}
};      

async function refreshAccessToken(token: any) {
    try {
      const refreshToken = token.refreshToken;
      if (typeof refreshToken !== 'string') {
        throw new Error('Invalid refresh token');
      }
  
      const url =
        'https://oauth2.googleapis.com/token?' +
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        });
  
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      });
  
      const refreshedTokens = await response.json();
  
      if (!response.ok) {
        throw refreshedTokens;
      }
  
      return {
        ...token,
        idToken: refreshedTokens.id_token,
        accessToken: refreshedTokens.access_token,
        accessTokenExpires:
          Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken:
          refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      };
    } catch (error) {
      console.log(error);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }
  }
  


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };




