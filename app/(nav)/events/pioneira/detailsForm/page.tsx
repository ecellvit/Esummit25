"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import validator from "validator";
import Image from "next/image";
import background from "@/assets/bg.png";
import logo from "@/assets/pioneira.svg";
import Loader from "@/components/loader";

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

export default function Page() {
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

  // Regular Expressions for Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]+(\/.*)?$/;

  // UseEffect for managing form data and session state
  useEffect(() => {
    const savedStep = localStorage.getItem("savedStep");
    if (savedStep) setStep(parseInt(savedStep, 10));

    const savedFormData = localStorage.getItem("pioneiraFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (session?.user && !session?.user?.hasFilledDetails) {
      router.push("/events/pioneira/detailsForm");
    }
  }, [session, router]);

  const saveStep = (step: number) => {
    localStorage.setItem("savedStep", step.toString());
  };

  // Form validation logic based on current step
  const validateStep = (): boolean => {
    switch (step) {
      case 1:
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
          toast.error("Invalid website link format. Add https://");
          return false;
        }
        if (!/^[A-Za-z ]+$/.test(formData.founderName)) {
          toast.error("Founder name must contain only letters and spaces");
          return false;
        }
        return true;
      case 2:
        if (!formData.startupStage) {
          toast.error("Please select a startup stage");
          return false;
        }
        return true;
      case 3:
        if (!formData.portfolioLink) {
          toast.error("Please provide a portfolio link");
          return false;
        }
        if (!urlRegex.test(formData.portfolioLink)) {
          toast.error("Invalid portfolio link");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Handle input changes and update formData
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "primaryContact" || name === "alternateContact") {
      const numberValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => {
        const updatedData = { ...prev, [name]: numberValue };
        localStorage.setItem("pioneiraFormData", JSON.stringify(updatedData));
        return updatedData;
      });
    } else {
      setFormData((prev) => {
        const updatedData = { ...prev, [name]: value };
        localStorage.setItem("pioneiraFormData", JSON.stringify(updatedData));
        return updatedData;
      });
    }
  };

  // Move to the next step after validation
  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      saveStep(step + 1);
    }
  };

  // Go to the previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      saveStep(step - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);

    try {
      const formattedData = {
        founderName: formData.founderName,
        email: formData.email,
        startupName: formData.startupName,
        primaryMobileNumber: formData.primaryContact,
        alternateMobileNumber: formData.alternateContact,
        websiteLink: formData.website,
        educationalInstitution: formData.institution,
        startupStage: formData.startupStage,
        trlLevel: formData.trlLevel,
        driveLink: formData.portfolioLink,
      };

      const response = await axios.post(
        "/api/pioneira/getDetails",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessTokenBackend}`,
          },
        }
      );

      await update({
        ...session,
        user: { ...session?.user, hasFilledDetails: true },
      });

      localStorage.removeItem("pioneiraFormData"); // Clear local storage on success
      toast.success(response.data.message || "Registration successful!");
      setTimeout(() => router.push("/"), 1000);
      localStorage.removeItem("savedStep");
      localStorage.removeItem("pioneiraFormData");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    return (
      <div
        className="border-box flex items-center justify-center bg-cover bg-center min-h-screen lg:pt-[0.75vh] px-4 sm:px-8"
        style={{
          backgroundImage: `url(${background.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <Loader />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-8 w-full max-w-6xl">
          <div className="rounded-2xl flex flex-col justify-center items-center shadow-lg bg-white opacity-90 p-5 sm:p-8">
            <Image
              src={logo}
              alt="redlogo"
              width={300}
              className="w-32 sm:w-96"
            />
          </div>
          <div className="flex items-center justify-center p-5 sm:p-8 bg-white opacity-90 rounded-2xl w-full">
            <div className="w-full max-w-lg">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 sm:gap-5"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-center">
                  Enter Your Information
                </h2>
                {step === 1 && (
                  <div>
                    {Object.entries(formData)
                      .slice(0, 7)
                      .map(([key, value]) => (
                        <div key={key} className="mb-4 sm:mb-5">
                          <label className="block text-gray-700 text-sm sm:text-base capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          <input
                            type={key.includes("Contact") ? "tel" : "text"}
                            name={key}
                            value={value || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-sm sm:text-base"
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
                      className="w-full bg-red-800 text-white p-2 rounded-lg text-sm sm:text-base"
                    >
                      Next
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <h3 className="font-bold text-lg">Stage of Startup</h3>
                    <div className="flex flex-col gap-2 text-justify">
                      {[
                        "Idea: You are refining your concept and have no working product.",
                        "MVP: You have a minimal product ready for testing with users.",
                        "Early Revenue: You have paying customers but are pre-scale.",
                        "Growth: You are scaling your operations and revenue",
                      ].map((stage) => (
                        <label key={stage} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="startupStage"
                            value={stage}
                            checked={formData.startupStage === stage}
                            onChange={handleChange}
                          />
                          {stage}
                        </label>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg mt-5">TRL Level</h3>
                    <select
                      name="trlLevel"
                      value={formData.trlLevel}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg text-sm sm:text-base"
                    >
                      {[...Array(9)].map((_, i) => (
                        <option key={i} value={`TRL ${i + 1}`}>
                          TRL {i + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full bg-gray-500 text-white p-2 rounded-lg mt-3 sm:mt-4 text-sm sm:text-base"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-red-800 text-white p-2 rounded-lg mt-2 text-sm sm:text-base"
                    >
                      Next
                    </button>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <h3 className="font-bold text-lg">
                      Upload a Drive Link with your Portfolio{" "}
                      <span className="text-red-600">*Required</span>
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
                      className="w-full p-2 border rounded-lg text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full bg-gray-500 text-white p-2 rounded-lg mt-3 sm:mt-4 text-sm sm:text-base"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-full bg-red-800 text-white p-2 rounded-lg mt-2 text-sm sm:text-base"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </form>
              <Toaster
                position="top-center"
                toastOptions={{ style: { zIndex: 1000000 } }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

 