import React, { useState } from "react";
import Connect from "./Connect";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center bg-black px-4 py-20">
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-[JazzFont] tracking-widest text-white text-4xl md:text-6xl mb-6 animate-float">
            SAY HELLO
          </h2>
          <div className="w-32 h-1 bg-purple-500 mx-auto animate-pulse"></div>
        </div>

        {/* Contact Form - Full Width */}
        <div className="w-full opacity-0 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
            <div className="space-y-8">
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b-2 border-gray-400 text-white px-3 py-4 focus:outline-none font-[JazzFont] tracking-wider transition-all duration-300 focus:border-purple-500"
                  placeholder="Your Name"
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b-2 border-gray-400 text-white px-3 py-4 focus:outline-none font-[JazzFont] tracking-wider transition-all duration-300 focus:border-purple-500"
                  placeholder="Your Email"
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              <div className="relative group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-transparent border-b-2 border-gray-400 text-white px-3 py-4 focus:outline-none font-[JazzFont] tracking-wider resize-none transition-all duration-300 focus:border-purple-500"
                  placeholder="Message"
                ></textarea>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </div>
            <div className="pt-4 flex justify-center">
  <button
    type="submit"
    disabled={isSubmitting}
    className="px-10 py-4 bg-gradient-to-r from-gray-400 to-purple-600 text-black font-[JazzFont] tracking-wider transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 inline-flex items-center rounded-sm"
  >
    {isSubmitting ? (
      <span className="animate-pulse">SENDING...</span>
    ) : (
      <>
        <span className="mr-3">SEND MESSAGE</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="w-5 h-5 transition-transform group-hover:translate-x-1"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M14 5l7 7m0 0l-7 7m7-7H3" 
          />
        </svg>
      </>
    )}
  </button>
</div>


            {submitSuccess && (
              <div className="mt-6 animate-fade-in">
                <p className="text-green-400 font-[JazzFont] tracking-wider animate-pulse text-lg">
                  MESSAGE SENT SUCCESSFULLY!
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Connect Section at the Bottom - Smaller Version */}
      <div className="mt-16 max-w-6xl w-full mx-auto">
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
          <div className="w-full h-1 bg-purple-500 mb-8"></div>
          <div className="flex justify-center">
            <div className="scale-75 transform-origin-center">
              <Connect />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;