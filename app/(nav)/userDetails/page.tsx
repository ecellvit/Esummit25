
"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Image from "next/image";
import background from "@/assets/bg.png";
import background1 from "@/assets/divbg.png";
import logo from "@/assets/redLogo.png";
import Loader from "@/components/loader";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/user/getUserDetails`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        if (data.success && !data.user?.email.endsWith("vitstudent.ac.in")) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [session, router]);

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
      [name]: name === "regNo" ? value.toUpperCase() : value,
    });
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.regNo) newErrors.regNo = "Registration number is required";
    else if (!/^\d{2}[A-Z]{3}\d{4}$/.test(formData.regNo.trim()))
      newErrors.regNo = "Invalid registration number format";
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
      const response: AxiosResponse<ApiResponse> = await axios.patch(
        "/api/user/addUserDetails",
        formData
      );

      if (!response.data.success) {
        toast.error(`Error: ${response.data.error || "Unknown error"}`);
        setLoading(false);
        return;
      }

      toast.success(response.data.message || "Form submitted successfully!");
      await update({
        ...session,
        user: { ...session?.user, hasFilledDetails: true, name: formData.name },
      });
      setFormData({ name: "", regNo: "", number: "" });
      setErrors({});
      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      toast.error("Form submission failed: Network error");
    }
  };

  // Show loader if session is still loading
  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div
      className="bg-cover bg-center flex items-center justify-center min-h-screen p-6"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {loading && <Loader />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl rounded-2xl shadow-lg p-8">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-2xl">
          <Image src={logo} alt="Red Logo" width={150} height={150} />
          <p className="mt-4 text-3xl font-bold text-red-800">E-SUMMIT'25</p>
        </div>

        {/* Right Form Box */}
        <div className="flex items-center justify-center p-4 lg:p-8 bg-white rounded-2xl shadow-md">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold text-gray-800">
                Enter Your Information
              </h2>

              {/* Full Name Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-lg font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  placeholder="Your name here"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="border rounded-md p-2 text-lg text-gray-800 border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring-2"
                />
              </div>

              {/* Registration Number Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="regNo"
                  className="text-lg font-medium text-gray-700"
                >
                  Registration Number
                </label>
                <input
                  placeholder="Your Reg. No here"
                  type="text"
                  id="regNo"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleChange}
                  className="border rounded-md p-2 text-lg text-gray-800 border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring-2"
                />
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="number"
                  className="text-lg font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  placeholder="Your Phone No here"
                  type="tel"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="border rounded-md p-2 text-lg text-gray-800 border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring-2"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 mt-2 bg-red-700 text-white text-lg font-semibold rounded-md hover:bg-red-800 transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></span>
                ) : (
                  "Register"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
