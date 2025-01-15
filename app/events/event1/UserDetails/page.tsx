'use client';
import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  regNo: string;
  number: string;
}

interface Errors {
  name?: string;
  regNo?: string;
  number?: string;
}

export default function UserDetail() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect user if not logged in, only when session status is 'authenticated'
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    regNo: "",
    number: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.regNo) newErrors.regNo = "Registration number is required";
    else if (!/^\d{2}[A-Za-z]{3}\d{4}$/.test(formData.regNo.trim()))
      newErrors.regNo = "Invalid registration number format";
    else if(/^\d{2}[a-z]{3}\d{4}$/.test(formData.regNo.trim()))
      newErrors.regNo = "enter Registration Number in capital";
    if (!formData.number) newErrors.number = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.number.trim()))
      newErrors.number = "Invalid phone number format";
    return newErrors;
  };
 
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.charCode;
    if (!/^[a-zA-Z ]+$/.test(String.fromCharCode(charCode))) {
      event.preventDefault();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.email}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Unknown error"}`);
        setLoading(false);
        return;
      }

      const result = await response.json();
      toast.success(result.message || "Form submitted successfully!");
      setFormData({ name: "", regNo: "", number: "" });
      setErrors({});
      setLoading(false);
      router.push('/')
    } catch (error) {
      setLoading(false);
      toast.error("Form submission failed: Network error");
    }
  };

  // Return loading state or form based on session
  if (status === "loading") {
    return <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"><div className="text-white text-2xl">Loading...</div></div>;
  }

  return (
    <div className="bg-cover bg-center bg-no-repeat">
      {loading && (
        <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
      <div className="flex justify-center items-center lg:grid-cols-3 min-h-screen gap-4 p-4 md:p-8 lg:p-10">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex items-center justify-center p-4 lg:p-8 bg-cover bg-center sm:border border-gray-600 rounded-3xl overflow-hidden">
          <div className="w-full max-w-md lg:max-w-lg">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-10 bg-transparent p-2 rounded-lg shadow-none min-w-[full] min-h-[full] text-3xl"
            >
              <div className="flex flex-col gap-2">
                <input
                  placeholder=" Full Name"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="border rounded-md text-2xl text-black border-gray-300 focus:ring-blue-200 focus:outline-none focus:ring-2 p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  placeholder=" Registration Number"
                  type="text"
                  id="regNo"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleChange}
                  className="border rounded-md text-2xl text-black border-gray-300 focus:ring-blue-200 focus:outline-none focus:ring-2 p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  placeholder=" Phone Number"
                  type="tel"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="border rounded-md text-2xl text-black border-gray-300 focus:ring-blue-200 focus:outline-none focus:ring-2 p-2"
                />
              </div>
              <button
                type="submit"
                className="p-2 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl hover:text-black active:transform transition duration-200 w-full h-auto text-center"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
