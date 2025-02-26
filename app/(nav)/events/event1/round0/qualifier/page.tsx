"use client";
import Loader from "@/components/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Qualifier: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      setIsLoading(true);
      getUserData();
    }
  }, [status]);

  const getUserData = () => {
    fetch(`/api/userInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessTokenBackend}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data.user;
        if (user.hasFilledDetails) {
          if (user.teamId == null) {
            router.push("/");
          } else {
            if (user.teamRole !== 0) {
              toast.error("Only leaders can access the quiz");
              router.push("/");
            } else {
              setIsLoading(false);
              // Redirect to instructions page
              router.push("/instructions");
            }
          }
        } else {
          toast.error("Please register for the Event first");
          router.push("/");
        }
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Error fetching user data.");
      });
  };

  return (
    <main className="min-h-screen pt-[5rem] bg-[#0e0e0e] p-6">
      {isLoading && <Loader />}
      <Toaster />
    </main>
  );
};

export default Qualifier;
