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
// "use client"; // Make this a Client Component
// import { signIn, signOut, useSession } from "next-auth/react";
// import { SessionProvider } from "next-auth/react";

// // Add className prop to the function component
// interface SignInBtnProps {
//   className?: string;
// }

// export default function SignInBtn({ className }: SignInBtnProps): JSX.Element {
//   const { status } = useSession();

//   return (
//     <div>
//       <SessionProvider>
//         <div className=
//         "bg-red-600 opacity-100 z-10 text-white flex flex-row text-wrap rounded-lg">
//           {status === "authenticated" ? (
//             <button onClick={() => signOut()} className="hover:text-red-600 hover:bg-white hover:shadow-sm hover:shadow-red-600 bg-red-600 text-white px-4 py-3 rounded-xl hover:scale-110 active:scale-95">
//               SIGN OUT
//             </button>
//           ) : (
//             <button onClick={() => signIn("google")} className="hover:text-red-600 hover:bg-white hover:shadow-sm hover:shadow-red-600 bg-red-600 text-white px-4 py-3 rounded-xl hover:scale-110 active:scale-95">
//               SIGN IN
//             </button>
//           )}
//         </div>
//       </SessionProvider>
//     </div>
//   );
// }

import { useSession, signIn, signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

export default function SignInBtn() {
  const { data: session, status } = useSession();

  return (
    <SessionProvider>
      <div className="flex justify-center items-center">
        <button
          onClick={status === "authenticated" ? () => signOut() : () => signIn("google")}
          className="bg-red-600 text-white font-semibold px-3 py-2 sm:px-4 sm:py-3 
                     rounded-xl hover:text-red-600 hover:bg-white hover:shadow-sm 
                     hover:shadow-red-600 hover:scale-105 active:scale-95 
                     transition-all duration-300 ease-in-out 
                     w-full max-w-[12.5rem] sm:max-w-[15.6rem] md:max-w-[18.75rem] 
                     text-sm sm:text-base md:text-sm"
        >
          {status === "authenticated" ? "SIGN OUT" : "SIGN IN"}
        </button>
      </div>
    </SessionProvider>
  );
}
