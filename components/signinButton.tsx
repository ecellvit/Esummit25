// components/signinButton.tsx
"use client"; // Make this a Client Component
import { SessionProvider } from "next-auth/react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInBtn(): JSX.Element {
  const { status } = useSession();

  return (
    <div>
    <SessionProvider>
      <div>
    <div className="relative align-middle w-[7vw] max-w-[600px] h-[7vh] bg-transparent opacity-100 z-10 text-white ">
      {status === "authenticated" ? (
        <button onClick={() => signOut()}>
          Sign Out
        </button>
      ) : (
        <button onClick={() => signIn("google")}>
          Sign In
        </button>
      )}
    </div>
    </div>
    </SessionProvider>
    </div>
  );
}
