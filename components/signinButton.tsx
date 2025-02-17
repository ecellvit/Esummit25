// // components/signinButton.tsx
// "use client"; // Make this a Client Component
// import { signIn, signOut, useSession } from "next-auth/react";

// export default function SignInBtn(): JSX.Element {
//   const { status } = useSession();

//   return (
//     <button 
//       onClick={status === "authenticated" ? () => signOut() : () => signIn("google")}
//       className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] px-4 py-2 bg-red-600 text-white flex items-center justify-center rounded-lg"
//     >
//       {status === "authenticated" ? "SIGN OUT" : "SIGN IN"}
//     </button>
//   );
// }


// components/signinButton.tsx
"use client"; // Make this a Client Component
import { signIn, signOut, useSession } from "next-auth/react";

// Add className prop to the function component
interface SignInBtnProps {
  className?: string;
}

export default function SignInBtn({ className }: SignInBtnProps): JSX.Element {
  const { status } = useSession();

  return (
    <button
      onClick={status === "authenticated" ? () => signOut() : () => signIn("google")}
      className="w-32 max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] px-2 py-2 bg-red-600 text-white flex items-center justify-center rounded-lg"
    >
      {status === "authenticated" ? "SIGN OUT" : "SIGN IN"}
    </button>
  );
}