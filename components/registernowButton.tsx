"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterBtn(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "authenticated") {
      if (!session.user.hasFilledDetails) {
        if (session.user.email.endsWith("@vitstudent.ac.in")) {
          router.push("/userDetails");
        } else {
          router.push("/events/pioneira/detailsForm");  
        }
        return;
      }
      router.push("#timeline");
    } else {
      signIn("google");
    }
  };

  return (
    <div>
    <div className="hidden md:block">
    <div className="relative top-18 left-1/2 transform -translate-x-1/2  z-10 w-full py-4 px-5 bg-transparent flex justify-center gap-12 flex-wrap">
      <button
        className="transition duration-300 ease-in-out hover:text-red-600 hover:bg-white hover:shadow-sm hover:shadow-red-600 bg-red-600 text-white px-4 py-3 rounded-xl hover:scale-110 active:scale-95"
        onClick={handleClick}
      >
        Register now
      </button>
    </div>
    </div>
    <div className="block md:hidden">
      <div className="relative top-18 left-1/2 transform -translate-x-1/2  z-10 w-full py-3 px-3 bg-transparent flex justify-center gap-18 flex-wrap">
      <button
        className="text-xs textransition duration-300 ease-in-out hover:text-red-600 hover:bg-white hover:shadow-sm hover:shadow-red-600 bg-red-600 text-white px-4 py-3 rounded-xl hover:scale-110 active:scale-95"
        onClick={handleClick}
      >
        Register now
      </button>
    </div>
    </div>
    </div>
  );
}
