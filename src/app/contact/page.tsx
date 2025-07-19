import React from "react";
import ContactForm from "@/components/forms/ContactForm";

const ContactPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 py-14 px-2 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-800 font-sans drop-shadow-lg tracking-tight">Contact Us</h1>
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage; 