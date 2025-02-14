"use client";
import React, { useState, ChangeEvent, FormEvent, KeyboardEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import background from "@/assets/bg.png";
import logo from "@/assets/pioneira.svg";

interface FormData {
  name: string;
  email: string;
  startupName: string;
  mobileNumber: string;
  driveLink: string;
  collegeName: string;
}

export default function RegistrationForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    startupName: "",
    mobileNumber: "",
    driveLink: "",
    collegeName: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Automatically capitalize name, collegeName, and regNo
    if ( name === "name" || name === "collegeName") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.accessTokenBackend) {
      toast.error("Unauthorized. Please log in.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    const forbiddenString = "vitstudent.ac.in";
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      formData.email.includes(forbiddenString)
    ) {
      toast.error("Invalid email format or restricted domain");
      setLoading(false);
      return;
    }

    if (
      formData.mobileNumber.length !== 10 ||
      /\D/.test(formData.mobileNumber)
    ) {
      toast.error("Mobile number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      // Log formData for debugging
      console.log("Submitting formData:", formData);

      const response = await axios.post("/api/pionera/getDetails", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessTokenBackend}`,
        },
      });

      toast.success(response.data.message || "Registration successful!");
      setFormData({
        name: "",
        email: "",
        startupName: "",
        mobileNumber: "",
        driveLink: "",
        collegeName: "",
      });
      setTimeout(() => router.push("/"), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-cover bg-center pt-[10vh]"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-8 w-full max-w-6xl">
        <div className="rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg bg-white opacity-90">
          <Image src={logo} alt="redlogo" width={500} />
        </div>
        <div className="flex items-center justify-center p-8 bg-white opacity-90 rounded-2xl">
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-3xl font-bold">Enter Your Information</h2>
              {Object.keys(formData).map((key) => (
                <div key={key} className="">
                  <label className="block text-gray-700 capitalize">
                    {key}
                  </label>
                  <input
                    type={
                      key === "email"
                        ? "email"
                        : key === "mobileNumber"
                        ? "tel"
                        : "text"
                    }
                    name={key}
                    value={formData[key as keyof FormData]}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    className="w-full p-2 border rounded-lg no-spinner"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-red-800 text-white p-2 rounded-lg"
                disabled={loading}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
