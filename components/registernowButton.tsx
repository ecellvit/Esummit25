"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterBtn(): JSX.Element {
  const { status } = useSession();
  const router = useRouter();

  // Automatically navigate to "#timeline" when the user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("#timeline");
    }
  }, [status, router]);

  const handleClick = () => {
    if (status === "authenticated") {
      router.push("#timeline");
    } else {
      signIn("google");
    }
  };

  return (
    <div className="relative top-18 left-1/2 transform -translate-x-1/2 z-10 w-full py-6 bg-transparent flex justify-center gap-12 flex-wrap">
    <button
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-5 rounded-3xl hover:scale-110 active:scale-95"
          onClick={handleClick}
        >
      Register now
    </button>
    </div>
  );
}
