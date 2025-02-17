"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import background from "@/assets/bg.png";
import logo from "@/assets/pioneira.svg";
import validator from "validator";

interface FormData {
  founderName: string;
  email: string;
  startupName: string;
  primaryContact: number | null;
  alternateContact: number | null;
  website: string;
  institution: string;
  startupStage: string;
  trlLevel: string;
  portfolioLink: string;
}



export default function page() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    founderName: "",
    email: "",
    startupName: "",
    primaryContact: null,
    alternateContact: null,
    website: "",
    institution: "",
    startupStage: "",
    trlLevel: "TRL 1",
    portfolioLink: "",
  });
  const [loading, setLoading] = useState(false);

  const emailRegex = /^(?!.*@vitstudent\.ac\.in$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]+(\/.*)?$/;

  const validateStep = () => {
    if (step === 1) {
      const requiredFields = [
        "founderName",
        "email",
        "startupName",
        "primaryContact",
        "institution",
      ];
      for (const field of requiredFields) {
        if (!formData[field as keyof FormData]) {
          toast.error("Please fill in all required fields");
          return false;
        }
      }
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return false;
      }
      if (
        formData.website &&
        !validator.isURL(formData.website, { require_protocol: true })
      ) {
        toast.error("Invalid website link format. Add https://");
        return false;
      }

      if (
        formData.primaryContact === null ||
        !phoneRegex.test(formData.primaryContact.toString())
      ) {
        toast.error("Primary contact must be a 10-digit number");
        return false;
      }
      if (
        formData.alternateContact !== null &&
        !phoneRegex.test(formData.alternateContact.toString())
      ) {
        toast.error("Alternate contact must be a 10-digit number");
        return false;
      }
      if (formData.website && !urlRegex.test(formData.website)) {
        toast.error("Invalid website URL");
        return false;
      }
      if (!/^[A-Za-z ]+$/.test(formData.founderName )) {
            toast.error("Founder name must contain only letters and spaces");
            return false;
          }
    }
    if (step === 2 && !formData.startupStage) {
      toast.error("Please select a startup stage");
      return false;
    }
    if (step === 3) {
      if (!formData.portfolioLink) {
        toast.error("Please provide a portfolio link");
        return false;
      }
      if (!urlRegex.test(formData.portfolioLink)) {
        toast.error("Invalid portfolio link");
        return false;
      }
    }
    return true;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "primaryContact" || name === "alternateContact") {
      // Remove any non-digit characters
      const numberValue = value.replace(/\D/g, "");
      // Limit to 10 digits
      const truncatedValue = numberValue.slice(0, 10);
      // Convert to number or null
      const finalValue = truncatedValue ? parseInt(truncatedValue, 10) : null;

      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    
    try {
      const formattedData = {
        founderName: formData.founderName,
        email: formData.email,
        startupName: formData.startupName,
        primaryMobileNumber: formData.primaryContact, // Renamed
        alternateMobileNumber: formData.alternateContact, // Renamed
        websiteLink: formData.website, // Renamed
        educationalInstitution: formData.institution, // Renamed
        startupStage: formData.startupStage,
        trlLevel: formData.trlLevel,
        driveLink: formData.portfolioLink, // Renamed
      };
      const response = await axios.post("/api/pioneira/getDetails", formattedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessTokenBackend}`,
        },
      });
      await update({...session, user: {...session?.user, hasFilledDetails: true}})
      toast.success(response.data.message || "Registration successful!");
      setTimeout(() => router.push("/"), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="border-box flex items-center justify-center bg-cover bg-center sm:min-h-screen min-h-screen lg:pt-[0.75vh] px-4 sm:px-8"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 w-full max-w-6xl">
        <div className="rounded-2xl flex flex-col justify-center mt-7 items-center shadow-lg bg-white opacity-90">
          <Image
            src={logo}
            alt="redlogo"
            width={300}
            className="w-48 sm:w-96"
          />
        </div>
        <div className="flex items-center justify-center sm:p-8 mt-7 bg-white opacity-90 rounded-2xl w-full">
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Enter Your Information
              </h2>

              {step === 1 && (
                <div>
                  {Object.entries(formData)
                    .slice(0, 7)
                    .map(([key, value]) => (
                      <div key={key} className="mb-5 mt-3">
                        <label className="block text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>{key.includes("website") &&<span className="text-red-600">*Required</span>}
                        <input
                          type={key.includes("Contact") ? "tel" : "text"}
                          name={key}
                          value={key.includes("Contact") ? value || "" : value}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-lg"
                          inputMode={
                            key.includes("Contact") ? "numeric" : "text"
                          }
                          pattern={
                            key.includes("Contact") ? "[0-9]*" : undefined
                          }
                          placeholder={
                            key.includes("Contact")
                              ? "Enter 10-digit number"
                              : ""
                          }
                        />
                      </div>
                    ))}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-red-800 text-white p-2 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex flex-col gap-7 mb-5">
                    <h3 className="font-bold text-lg">Stage of Startup <span className="text-red-600">*Required</span></h3>
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          id: "idea",
                          label:
                            "Idea: You are refining your concept and have no working product.",
                          value: "Idea",
                        },
                        {
                          id: "mvp",
                          label:
                            "MVP: You have a minimal product ready for testing with users.",
                          value: "MVP",
                        },
                        {
                          id: "early-revenue",
                          label:
                            "Early Revenue: You have paying customers but are pre-scale.",
                          value: "Early Revenue",
                        },
                        {
                          id: "growth",
                          label:
                            "Growth: You are scaling your operations and revenue.",
                          value: "Growth",
                        },
                      ].map((option) => (
                        <div key={option.id}>
                          <input
                            type="radio"
                            id={option.id}
                            name="startupStage"
                            value={option.value}
                            checked={formData.startupStage === option.value}
                            onChange={handleChange}
                          />
                          <label htmlFor={option.id} className="ml-2">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        Which TRL (Technology Readiness Level) is your startup
                        currently on? <span className="text-red-600">*Required</span>
                      </h3>
                      <select
                        name="trlLevel"
                        value={formData.trlLevel}
                        onChange={handleChange}
                        className="outline outline-red-800 border-red-800 text-lg mt-5 rounded-md p-2 pr-10"
                      >
                        {[...Array(9)].map((_, i) => (
                          <option key={i} value={`TRL ${i + 1}`}>
                            TRL {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full bg-gray-500 text-white p-2 rounded-lg mt-4 mb-4"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-red-800 text-white p-2 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Upload a Drive Link with your Portfolio <span className="text-red-600">*Required</span>
                    </h3>
                    <div className="text-md">
                      <p>
                        Open{" "}
                        <a
                          href="https://drive.google.com/file/d/17Z4OfK0FrrgAzOVL2iL8ibRykKYPOU0Z/view"
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          PORTFOLIO_REFERENCE
                        </a>{" "}
                        to understand the submission guidelines.
                      </p>
                      <p>
                        Open{" "}
                        <a
                          href="https://drive.google.com/file/d/1LWNAkJficEQFg6mOHmdxgdTAJ2_6oWBe/view"
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          PORTFOLIO_TEMPLATE
                        </a>{" "}
                        with{" "}
                        <a
                          href="https://www.canva.com/pdf-editor/"
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          CANVA_PDF-editor
                        </a>{" "}
                      </p>
                      <p>
                        Edit the template based on the instructions in{" "}
                        <strong>PORTFOLIO_REFERENCE</strong>, ensuring all
                        sections are completed.
                      </p>
                      <p className="font-bold text-red-600">
                        NOTE: Existing completed portfolios are welcome! You may
                        submit it directly without further modifications.
                      </p>
                      <p>
                        Ensure that you provide access to the drive link for
                        viewing the portfolio.
                      </p>
                    </div>
                    <input
                      type="text"
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleChange}
                      placeholder="Enter the link"
                      className="w-full p-2 border rounded-lg no-spinner mt-5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full bg-gray-500 text-white p-2 rounded-lg mt-4 mb-4"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-red-800 text-white p-2 rounded-lg"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}
            </form>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  zIndex:1000000, // Adjust Toaster's z-index
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}