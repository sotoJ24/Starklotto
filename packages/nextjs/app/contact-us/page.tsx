"use client";

import React, { useEffect, useState } from "react";
import { UserIcon, EnvelopeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { ContactUsFormData } from "~~/interfaces/contact-us";
import { CONTACT_US_SHEET_SCRIPT } from "~~/utils/Constants";

const ContactUsPage = () => {

  const [formData, setFormData] = useState<ContactUsFormData>({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState<ContactUsFormData>({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar el campo correspondiente y actualizar errores
    if (name === "name" && value !== "") {
        setErrors(prev => ({ ...prev, name: "" }));
    }
    if (name === "email") {
        if (value === "") {
            setErrors(prev => ({ ...prev, email: "Email is required" }));
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            setErrors(prev => ({ ...prev, email: "Email is invalid" }));
        } else {
            setErrors(prev => ({ ...prev, email: "" }));
        }
    }
    if (name === "message" && value !== "") {
        setErrors(prev => ({ ...prev, message: "" }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    let hasErrors = false;

    if (formData.name === "") {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
      hasErrors = true;
    }
    if (formData.email === "") {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Email is invalid" }));
      hasErrors = true;
    }
    if (formData.message === "") {
      setErrors(prev => ({ ...prev, message: "Message is required" }));
      hasErrors = true;
    }

    if (hasErrors) return; // Detener si hay errores

    try {
        await fetch(CONTACT_US_SHEET_SCRIPT, {
            method: "POST",
            mode: 'no-cors', 
            cache: 'no-cache', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        setIsSubmitted(true);
    } catch (error) {
        setSubmitError("There was a problem sending the message.");
    }

    // Reiniciar el formulario
    setFormData({ name: "", email: "", message: "" });
    setErrors({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  useEffect(() => {
    if(submitError){
      setTimeout(() => {
        setSubmitError("");
      }, 3000);
    }

    if (isSubmitted) {
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  }, [isSubmitted, submitError]);

  return (
    <div className="text-white text-center py-20">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="mt-4 text-lg">Have any questions? Reach out to us!</p>
      <form onSubmit={onSubmit} className="mt-8 max-w-md mx-auto bg-[#1A1A1A] p-4 rounded">
        <div className="mb-4">
          <label
            className="flex items-center text-left mb-2"
            htmlFor="fullName"
          >
            Full Name
            <UserIcon className="h-5 w-5 text-white ml-2" />
          </label>
          <input
            type="text"
            name="name" 
            value={formData.name}
            onChange={handleChange}                                    
            className="w-full p-2 border border-gray-300 rounded bg-[#2A2A2A] text-white text-sm"
            placeholder="YOUR NAME"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="flex items-center text-left mb-2" htmlFor="email">
            Email Address
            <EnvelopeIcon className="h-5 w-5 text-white ml-2" />
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-[#2A2A2A] text-white text-sm"
            placeholder="YOUR@EMAIL.COM"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="flex items-center text-left mb-2" htmlFor="message">
            Your Message
            <PencilSquareIcon className="h-5 w-5 text-white ml-2" />
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-[#2A2A2A] text-white text-sm"
            rows={4}
            placeholder="YOUR MESSAGE..."
          />
          {errors.message && <p className="text-red-500">{errors.message}</p>}
        </div>

        <button type="submit" className="bg-gradient-to-r from-[#3A0909] to-[#000000] text-white py-2 px-4 rounded" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Contact Us"}
        </button>
      </form>
      {submitError && <p className="text-red-500 mt-4">{submitError}</p>}   
      {
        isSubmitted && !submitError && <p className="mt-4 text-yellow-400 text-lg">Message sent successfully!</p>
      }
    </div>
  );
};

export default ContactUsPage;
