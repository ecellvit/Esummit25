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
        {/* sm:w-[60vw] md:w-[50vw] lg:w-[10vw] max-w-[600px] h-[8vh] sm:h-[8vh] md:h-[7vh] lg:h-[6vh] bg-red-600 opacity-100 z-10 text-white flex items-center justify-center rounded-lg */}
          {status === "authenticated" ? (
            <button onClick={() => signOut()} className="hover:text-red-600 hover:bg-white hover:shadow-sm hover:shadow-red-600 bg-red-600 text-white px-4 py-3 rounded-xl hover:scale-110 active:scale-95">
              SIGN OUT
            </button>
          ) : (
            <button onClick={() => signIn("google")} className="hover:text-red-600 hover:bg-white hover:shadow-sm hover:shadow-red-600 bg-red-600 text-white px-4 py-3 rounded-xl hover:scale-110 active:scale-95">
              SIGN IN
            </button>
          )}
        </div>
      </SessionProvider>
    </div>
  );
}
