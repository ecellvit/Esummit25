"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterBtn(): JSX.Element {
  const { status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "authenticated") {
      router.push("#timeline");
    } else {
      signIn("google");
    }
  };

  return (
    <div className="relative top-18 left-1/2 transform -translate-x-1/2 z-10 w-full py-4 px-5 bg-transparent flex justify-center gap-12 flex-wrap">
      <button
        className="hover:text-red-600 hover:bg-white hover:shadow-sm hover:shadow-red-600 bg-red-600 text-white px-4 py-3 rounded-xl hover:scale-110 active:scale-95"
        onClick={handleClick}
      >
        Register now
      </button>
    </div>
  );
}
