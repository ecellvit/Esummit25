"use client";
import React, { useState, useEffect } from "react";
import resourceData from "@/constant/round1/element.json";
import { initializeSocket, socket } from "@/socket";
import toast, { Toaster } from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import lock from "@/assets/round1/lock.svg";
import Image from "next/image";

interface Resource {
  id: number;
  name: string;
  cost: number;
  rate: number;
}

function ResourceCard({
  resource,
  onBuy,
  isPrimary = false,
  isSecondary = false,
}: {
  resource: Resource;
  onBuy: () => void;
  isPrimary?: boolean;
  isSecondary?: boolean;
}) {
  return (
    <div
      onClick={(isPrimary || isSecondary) ? undefined : onBuy}
      className={`flex flex-col items-center justify-between p-6 rounded-xl transition-all duration-300 ${isPrimary || isSecondary ? "opacity-90" : "transform hover:scale-105 cursor-pointer"
        } relative overflow-hidden w-full`}
      style={{
        border: "4.662px solid #FFF",
        background: (isPrimary || isSecondary)
          ? "linear-gradient(114deg, rgba(82, 82, 82, 0.20) 15.11%, rgba(106, 83, 83, 0.20) 66.74%)"
          : "linear-gradient(114deg, rgba(232, 232, 232, 0.10) 15.11%, rgba(187, 33, 33, 0.08) 81.96%)",
        boxShadow:
          "0px 9.324px 18.649px 0px rgba(0, 0, 0, 0.20), 0px 5.328px 0px 0px rgba(0, 0, 0, 0.20)",
        fontFamily: "Poppins",
      }}
    >
      {(isPrimary || isSecondary) && (
        <div className="absolute inset-0 flex items-center justify-center opacity-80 bg-black bg-opacity-25 z-10">
          <Image src={lock} alt="Locked" className="w-16 h-16" />
        </div>
      )}
      <div
        className={`absolute top-0 right-0 w-16 h-16 blur-xl rotate-45 translate-x-8 -translate-y-8 opacity-80 ${(isPrimary || isSecondary)
            ? "bg-gradient-to-br from-[#525252] to-[#6A5353]"
            : "bg-gradient-to-br from-[#BB2121] to-[#E8E8E8]"
          }`}
      ></div>

      <p className="text-xl font-extrabold uppercase text-[#BB2121] tracking-wider">
        {resource.name}
      </p>

      <div className="w-full h-1 bg-[#BB2121] my-3 "></div>

      <p className="text-md text-black font-medium">
        Cost:{" "}
        <span className="font-bold text-black">
          {resource.cost.toLocaleString()}
        </span>
      </p>
      <p className="text-md text-black font-medium">
        Rate: <span className="font-bold">{resource.rate}</span> ton/min
      </p>

      {!(isPrimary || isSecondary) ? (
        <button
          className="mt-4 px-6 py-2 bg-[#B82121] text-white rounded-lg transition-all duration-300 hover:bg-[#8a1919] hover:shadow-md hover:scale-105 font-extrabold tracking-widest"
          style={{
            fontFamily: "FontSpring",
          }}
        >
        LEASE
      </button>
      ) : (
        <div
          className="mt-4 px-6 py-2 bg-[#756262] text-white rounded-lg font-extrabold tracking-widest"
          style={{
            fontFamily: "FontSpring",
          }}
        >
          BOUGHT
        </div>
      )}
    </div>
  );
}

export default function Testing() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [loading, setLoading] = useState<Boolean>(true);
  const [socketLoading, setSocketLoading] = useState<Boolean>(true);
  const [primaryElement, setPrimaryElement] = useState<number | null>();
  const [secondaryElement, setSecondaryElement] = useState<number | null>();

  // Check if the round has started/finished
  const getPageData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/event1/getPageDetails", {
        method: "GET",
      });

      if (response.status === 200) {
        const { round, page, startedAt } = await response.json();

        // Convert startedAt (ISO format) to timestamp
        const startTime = new Date(startedAt).getTime();
        const currentTime = Date.now();

        if (
          (
            round !== 1 ||
            page !== 3 ||
            currentTime - startTime > 5 * 60 * 1000
          )
        ) {
          if (round <= 1 && page > 3) {
            toast.error("This round is over.");
          } else {
            toast.error("This round has not started yet.");
          }
          router.push(`/events/event1/round1/waiting`);
          return;
        } else {
          try {
            const response = await fetch("/api/event1/userInfo", {
              method: "GET",
            });
            if (response.ok) {
              const data = await response.json();
              const ele1 = data?.team.primaryElement;
              setPrimaryElement(ele1);
              const ele2 = data?.team.secondaryElement;
              setSecondaryElement(ele2);
            } else {
              console.log("bad response", response.status);
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        router.refresh();
        console.log(response);
      }
    } catch (err) {
      console.log("first fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPageData();
  }, []);

  // Load JSON data directly
  useEffect(() => {
    setResources(resourceData);
  }, []);

  // Connect to socket server

  useEffect(() => {
    // Initial connection status check
    console.log("Socket connection status:", socket.connected);

    if (socket.connected) {
      setSocketLoading(false);
      onConnect();
    }

    async function setupSocket() {
      const result = await initializeSocket();

      if (!result.success) {
        setSocketLoading(true);
        setupSocket();
      }

      setSocketLoading(false);
    }

    if (!socket.connected) {
      setupSocket();
    }

    function onConnect() {
      socket.io.engine.on("upgrade", (transport) => {
        console.log("upgrade ::", transport.name);
      });
    }

    function onDisconnect(reason: string) {
      console.warn("Socket disconnected:", reason);
      if (reason === "ping timeout" || reason === "transport error") {
        socket.connect(); // Try reconnecting manually
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket.connected]);

  const handleConfirmPurchase = async () => {
    if (selectedResource) {
      console.log("Purchase confirmed:", {
        id: selectedResource.id,
        resource: selectedResource.name,
        cost: selectedResource.cost,
        rate: selectedResource.rate,
      });

      setLoading(true);
      //? SEND THE AXIOS QUERY
      try {
        const response = await axios.put("/api/event1/round1/leasing2", {
          leaseElement: selectedResource.id,
          leaseRate: selectedResource.rate,
          cost: selectedResource.cost,
        });

        if (response.status === 200) {
          socket.emit("lease2", selectedResource.id);
          toast.success("Resource successfully leased!");
          router.push('/events/event1/round1/lease2&upgrade');
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError) {
          const errorData = axiosError.response?.data as ApiResponse;
          toast.error(errorData.message || "Error in leasing the resource");
        } else {
          toast.error("An error occurred while leasing the resource.");
        }
      }
      setSelectedResource(null);
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    console.log("Going back to previous page");
    setTimeout(() => {
        window.history.back();
    }, 500);
  };

  return (
    <div className="aboslute w-full h-full min-h-screen bg-[#232323]">
      {/* Loader */}
      {(loading || socketLoading) && <Loader />}

      <div
        className={`my-10 container w-[85vw] h-[85vh] py-20 px-auto text-center relative z-10 mx-auto transition-all duration-300 rounded-lg overflow-y-auto scrollbar-hide ${selectedResource ? "blur-md pointer-events-none scale-99" : ""
          }`}
      >
        <h1 className="text-4xl font-extrabold my-6 text-black drop-shadow-md">
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500"
            style={{ fontFamily: "GreaterTheory" }}
          >
            Lease 2 Element
          </span>
        </h1>
        <h6
          className="text-lg font-medium text-gray-800 mb-8"
          style={{ fontFamily: "FontSpring" }}
        >
          Choose wisely, as you will lease this element for next 10 minutes. You
          can lease multiple elements but not the primary or secondary ones.
        </h6>

        {/* Unified Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 max-w-6xl mx-auto">
          {resources.map((res, index) => {
            const isPrimary = index === primaryElement;
            const isSecondary = index === secondaryElement;
            return (
              <ResourceCard
                key={res.id}
                resource={res}
                onBuy={() => {
                  if (!isPrimary && !isSecondary) {
                    setSelectedResource(res);
                  }
                }}
                isPrimary={isPrimary}
                isSecondary={isSecondary}
              />
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleGoBack}
            className="px-8 py-3 text-white transition-all duration-300 shadow-lg active:shadow active:translate-y-1 flex items-center bg-[#B82121] rounded-lg hover:bg-[#8a1919] hover:shadow-md hover:scale-105  font-extrabold tracking-widest"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedResource && (
        <div className="fixed inset-0 flex items-center justify-center bg-red-900 bg-opacity-10 backdrop-blur-md z-50 transition-all duration-300">
          <div
            className="text-center w-[80%] max-w-2xl mx-4 transform transition-all duration-500 rounded-3xl overflow-hidden border-white border-4 "
            style={{
              background: "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)",
            }}
          >
            <h2
              className="text-xl font-bold my-8 pt-6 text-white"
              style={{ fontFamily: "GreaterTheory" }}
            >
              Do You Want To Lease This Item ?
            </h2>
            <div
              className="overflow-hidden w-[60%] mx-auto"
              style={{ fontFamily: "Poppins" }}
            >
              <div className="bg-[#380F0F] py-3">
                <p className="text-xl font-bold text-white">CONFIRM LEASE</p>
              </div>
              <div className="bg-white p-6">
                <p
                  className="text-3xl font-bold mb-4"
                  style={{
                    background:
                      "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {selectedResource.name}
                </p>
                <div className="flex justify-between items-center mb-3 px-4">
                  <p className="text-gray-600 font-medium text-xl">Cost:</p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      background:
                        "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {selectedResource.cost.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center px-4">
                  <p className="text-gray-600 font-medium text-xl">Rate:</p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      background:
                        "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {selectedResource.rate} ton/min
                  </p>
                </div>
              </div>
            </div>
            <div
              className="my-8 flex justify-center gap-12 pb-6"
              style={{ fontFamily: "FontSpring" }}
            >
              <button
                onClick={() => setSelectedResource(null)}
                className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-8 py-4 flex justify-center text-white font-bold rounded-md"
                style={{
                  background:
                    "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)",
                }}
              >
                {loading ?<span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>:"Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
