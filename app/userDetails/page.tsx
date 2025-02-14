'use client';
import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Image from "next/image";
import background from "@/assets/bg.png"
import background1 from "@/assets/divbg.png"
import logo from "@/assets/redLogo.png"
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
  const { data: session, status, update } = useSession();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("http://localhost:3000/api/user/getUserDetails", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  
  //       if (!res.ok) {
  //         return;
  //       }
  
  //       const data = await res.json();
  
  //       if (data.success && data.user?.hasFilledDetails) {
  //         router.push("/");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   };
  
  //   fetchData();
  // }, [session, router]);
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
      [name]: name==="regNo"?value.toUpperCase():value,
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
      const response: AxiosResponse<ApiResponse> = await axios.patch('/api/user/addUserDetails', formData);

      if (!response.data.success) {
        const errorData = response.data.error ?? response.data.message; //? If error is not available then return message
        toast.error(`Error: ${errorData || "Unknown error"}`);
        setLoading(false);
        return;
      }

      const result = response.data.message;
      toast.success(result || "Form submitted successfully!");
      await update({...session, user: {...session?.user, hasFilledDetails: true, name: formData.name } });
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
    <div
      className="bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        
      }}
    >
      {loading && (
        <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-11 w-full ">
        
        <div className=" rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg bg-white opacity-100"
        // style={{backgroundImage: `url(${background1.src})`}}
        >
         <div className="flex flex-col items-center">
  <Image 
    src={logo} 
    alt="redlogo" 
    width={200} 
    height={200} 
    className="cursor-pointer"
  />
  <p className="mt-3 text-3xl font-bold font-Gotham Black text-red-800"
  style={{ fontFamily: "Classic Sans", letterSpacing: "0%" }}>E-SUMMIT'25</p>
</div>
        </div>
  
        {/* Right Form Box */}
        <div className="flex items-center justify-center p-4 lg:p-8 bg-cover bg-center rounded-2xl overflow-hidden  bg-white opacity-100"
        // style={{backgroundImage: `url(${background1.src})`}}
        >
          <div className="w-full max-w-md lg:max-w-lg">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 bg-transparent p-2 rounded-lg shadow-none text-3xl"
            >
              <h2><b>Enter Your Information</b></h2>
              <div className="flex flex-col gap-3">
                <label htmlFor="full Name"  className="block text-lg font-medium ">Full Name</label>
                <input
                  placeholder="Your name here"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="border rounded-md text-2xl text-black border-gray-300 focus:ring-blue-200 focus:outline-none focus:ring-2 p-2"
                />
              </div>
              <div className="flex flex-col gap-3">
              <label htmlFor="regNo"  className="block text-lg font-medium">Registration Number</label>
                <input
                  placeholder="Your Reg. no here"
                  type="text"
                  id="regNo"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleChange}
                  className="border rounded-md text-2xl text-black border-gray-300 focus:ring-blue-200 focus:outline-none focus:ring-2 p-2"
                />
              </div>
              <div className="flex flex-col gap-3">
              <label htmlFor="number"  className="block text-lg font-medium ">Phone Number</label>
                <input
                  placeholder="Your Phone no. here"
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
                className="p-2 bg-red-800 rounded-lg text-white text-xl hover:text-black active:transform transition duration-200 h-auto text-center w-24 font-sans"
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
