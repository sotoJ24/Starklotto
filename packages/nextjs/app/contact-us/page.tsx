import React from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const ContactUsPage = () => {
  return (
    <div className="text-white text-center py-20">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="mt-4 text-lg">Have any questions? Reach out to us!</p>
      <form className="mt-8 max-w-md mx-auto bg-[#1A1A1A] p-4 rounded">
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
            id="fullName"
            className="w-full p-2 border border-gray-300 rounded bg-[#2A2A2A] text-white text-sm"
            placeholder="YOUR NAME"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center text-left mb-2" htmlFor="email">
            Email Address
            <EnvelopeIcon className="h-5 w-5 text-white ml-2" />
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded bg-[#2A2A2A] text-white text-sm"
            placeholder="YOUR@EMAIL.COM"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center text-left mb-2" htmlFor="message">
            Your Message
            <PencilSquareIcon className="h-5 w-5 text-white ml-2" />
          </label>
          <textarea
            id="message"
            className="w-full p-2 border border-gray-300 rounded bg-[#2A2A2A] text-white text-sm"
            rows={4}
            placeholder="YOUR MESSAGE..."
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-[#3A0909] to-[#000000] text-white py-2 px-4 rounded"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUsPage;
