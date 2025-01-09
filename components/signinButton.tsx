// components/signinButton.tsx
"use client"; // Make this a Client Component
import { SessionProvider } from "next-auth/react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInBtn(): JSX.Element {
  const { status } = useSession();

  return (
    <SessionProvider>
    <div className="text-black font-bold text-xl md:text-sm bg-sky-500 p-3 rounded-lg w-20 m-2">
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
    </SessionProvider>
  );
}
