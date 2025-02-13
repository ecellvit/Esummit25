"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import background from "@/assets/bg.png";

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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.accessTokenBackend) {
      toast.error("Unauthorized. Please log in.");
      setLoading(false);
      return;
    }

    // Basic validation
    const forbiddenString = "vitstudent.ac.in";
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      formData.email.includes(forbiddenString)
    ) {
      toast.error("Invalid email format or restricted domain");
      setLoading(false);
      return;
    }
    if (formData.mobileNumber.length < 10) {
      toast.error("Mobile number must be at least 10 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/pionera/getDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessTokenBackend}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Registration successful!");

        // Clear all input fields
        setFormData({
          name: "",
          email: "",
          startupName: "",
          mobileNumber: "",
          driveLink: "",
          collegeName: "",
        });

        // Redirect to landing page after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
   className="flex items-center justify-center h-screen"
   style={{
     backgroundImage: `url(${background.src})`,
     backgroundSize: 'cover',
   }}
>
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-align-center font-sans">Enter Your Information</h2>
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-3">
            <label className="block text-gray-700 capitalize">{key}</label>
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
              className="w-full p-2 border rounded-lg no-spinner"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <Toaster />
    </main>
  );
}
