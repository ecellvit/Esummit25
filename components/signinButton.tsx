// components/signinButton.tsx
"use client"; // Make this a Client Component
import { SessionProvider } from "next-auth/react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInBtn(): JSX.Element {
  const { status } = useSession();

  return (
    <div>
      <SessionProvider>
        <div className="relative w-full sm:w-[60vw] md:w-[50vw] lg:w-[10vw] max-w-[600px] h-[7vh] sm:h-[7vh] md:h-[7vh] lg:h-[6vh] bg-red-600 opacity-100 z-10 text-white flex items-center justify-center rounded-lg">
        {/* sm:w-[60vw] md:w-[50vw] lg:w-[10vw] max-w-[600px] h-[8vh] sm:h-[8vh] md:h-[7vh] lg:h-[6vh] bg-red-600 opacity-100 z-10 text-white flex items-center justify-center rounded-lg */}
          {status === "authenticated" ? (
            <button onClick={() => signOut()} className="w-full h-full flex items-center justify-center">
              SIGN OUT
            </button>
          ) : (
            <button onClick={() => signIn("google")} className="w-full h-full flex items-center justify-center">
              SIGN IN
            </button>
          )}
        </div>
      </SessionProvider>
    </div>
  );
}
