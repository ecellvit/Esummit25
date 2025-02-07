import { dbConnect } from '@/lib/dbConnect';
import { Users } from '@/models/user.model';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import NextAuth, { NextAuthOptions, Session, User} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { generateTokens } from '../../login/generateTokensUser/route';

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
  interface Session {
    accessToken?: string;
    accessTokenBackend?: string;
    idToken?: string;
    error?: string;
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

export const authOptions: NextAuthOptions = {
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
    async jwt({ token, user, account }) {
      // Type `token` explicitly to avoid 'unknown' type
      const typedToken = token as JWT & {
        accessTokenExpires?: number;
        accessToken: string;
        refreshToken: string;
        idToken: string | undefined;
        accessTokenFromBackend?: string;
      };

      if (account && user) {
        return {
          idToken: account.id_token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0, // Fallback to 0 if undefined
          refreshToken: account.refresh_token ?? '', // Default to empty string if undefined
          accessTokenFromBackend: await gettokenfrombackend(user, account),
          user,
        };
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
        };
      
        session.user = typedToken.user as { name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined };
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
            image: null
          },
          accessToken: null,
          accessTokenBackend: null,
          error: null,
          idToken: null,
        };
      },

    async redirect({ url, baseUrl }) {
      try {
        const res = await fetch("http://localhost:3000/api/user/getUserDetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${session?.accessTokenBackend}`,
            "Access-Control-Allow-Origin": "*",
          },
        });


    
        if (!res.ok) {
          return "/events/event1/UserDetails"; // Default to form if API request fails
        }
    
        const data = await res.json();
        console.log("Redirect response:", data);

        console.log("Redirect response:", data);
        if (data.success && data.user?.hasFilledDetails) {
          return "/"; // Redirect to home if details are filled
        } else {
          return "/events/event1/UserDetails"; // Otherwise, redirect to the form page
        }
      } catch (error) {
        console.error("Error in redirect:", error);
        return "/events/event1/UserDetails"; // Fallback in case of an error
      }
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
