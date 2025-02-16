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
    <div className="relative align-middle w-[7vw] max-w-[600px] h-[4vh] bg-red-600 opacity-100 z-10 text-white flex items-center justify-center rounded-lg">

      {status === "authenticated" ? (
        <button onClick={() => signOut()}>
          SIGN OUT
        </button>
      ) : (
        <button onClick={() => signIn("google")}>
          SIGN IN
        </button>
      )}
    </div>
    </div>
    </SessionProvider>
    </div>
  );
}
