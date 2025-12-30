import React from "react";
import { toast } from "react-toastify";
import Call from "../components/UI/Call";
import Contact from "./Contact";
import Connect from "./Connect";

const CombinedContact = () => {
  return (
    <section id="combined-contact" className="min-h-screen bg-black px-4 py-20">
      <style>{`
        @keyframes rotate-border {
          to {
            transform: rotate(360deg);
          }
        }

        .contact-card {
          --white: hsl(0, 0%, 100%);
          --black: hsl(240, 15%, 9%);
          --paragraph: hsl(0, 0%, 83%);
          --line: hsl(240, 9%, 17%);
          --primary: hsl(266, 92%, 58%);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 2rem;
          width: 100%;
          background-color: hsla(240, 15%, 9%, 1);
          background-image: radial-gradient(
            at 88% 40%,
            hsla(240, 15%, 9%, 1) 0px,
            transparent 85%
          ),
          radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
          radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
          radial-gradient(at 0% 64%, hsla(263, 70%, 35%, 1) 0px, transparent 85%),
          radial-gradient(at 41% 94%, hsla(284, 80%, 40%, 1) 0px, transparent 85%),
          radial-gradient(at 100% 99%, hsla(306, 80%, 35%, 1) 0px, transparent 85%);
          border-radius: 1rem;
          box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.15) inset;
        }

        .contact-card .card__border {
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          z-index: -10;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          background-image: linear-gradient(
            0deg,
            hsl(0, 0%, 100%) -50%,
            hsl(0, 0%, 40%) 100%
          );
          border-radius: 1rem;
        }

        .contact-card .card__border::before {
          content: "";
          pointer-events: none;
          position: fixed;
          z-index: 200;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%), rotate(0deg);
          transform-origin: left;
          width: 200%;
          height: 10rem;
          background-image: linear-gradient(
            0deg,
            hsla(0, 0%, 100%, 0) 0%,
            hsl(277, 95%, 60%) 40%,
            hsl(277, 95%, 60%) 60%,
            hsla(0, 0%, 40%, 0) 100%
          );
          animation: rotate-border 8s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl w-full mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-start">
          {/* Left Side - Call Component and Connect Section */}
          <div className="space-y-12 opacity-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            {/* Call Component */}
            <Call />

            {/* Connect Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-1 bg-purple-500 mb-8"></div>
              <Connect />
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            {/* Contact Form Section with Card Styling */}
            <div className="w-full contact-card">
              <div className="card__border" />
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Extracted Contact Form Component for reusability
const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success toast notification
      toast.success("MESSAGE SENT SUCCESSFULLY!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Reset form after successful submission
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
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
            rows="4"
            className="w-full bg-transparent border-b-2 border-gray-400 text-white px-3 py-4 focus:outline-none font-[JazzFont] tracking-wider resize-none transition-all duration-300 focus:border-purple-500"
            placeholder="Your Message"
          ></textarea>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></div>
        </div>
      </div>

      <div className="pt-4 flex justify-start">
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
    </form>
  );
};

export default CombinedContact;
