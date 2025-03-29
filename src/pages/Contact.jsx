import React, { useState } from "react";

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
    <section id="contact" className="min-h-screen flex items-center justify-center bg-black px-4 py-20">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-[JazzFont] tracking-widest text-white text-4xl md:text-6xl mb-6 animate-float">
            SAY HELLO
          </h2>
          <div className="w-32 h-1 bg-purple-500 mx-auto animate-pulse"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Contact Form - Left Side */}
          <div className="w-full md:w-3/5 opacity-0 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <form onSubmit={handleSubmit} className="space-y-10">
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

              <div className="pt-4">
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

          {/* Social Media Icons - Right Side */}
          <div className="w-full md:w-2/5 flex flex-col justify-center items-center md:items-start mt-16 md:mt-0 opacity-0 animate-slide-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <h3 className="font-[JazzFont] tracking-wider text-white text-2xl mb-12 text-center md:text-left relative">
              CONNECT WITH ME
              <div className="absolute -bottom-4 left-0 w-16 h-0.5 bg-purple-500 md:block hidden"></div>
            </h3>
            
            <div className="flex flex-col space-y-8 ">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="flex items-center space-x-6 transform transition-all duration-300 hover:translate-x-2 group">
                <div className="p-3 rounded-full bg-black border border-purple-500 group-hover:bg-purple-500/20 transition-all duration-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-purple-500"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span className="font-[JazzFont] tracking-wider text-white group-hover:text-purple-400 transition-colors text-lg">INSTAGRAM</span>
              </a>
              
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="flex items-center space-x-6 transform transition-all duration-300 hover:translate-x-2 group">
                <div className="p-3 rounded-full bg-black border border-purple-500 group-hover:bg-purple-500/20 transition-all duration-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-purple-500"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <span className="font-[JazzFont] tracking-wider text-white group-hover:text-purple-400 transition-colors text-lg">GITHUB</span>
              </a>
              
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="flex items-center space-x-6 transform transition-all duration-300 hover:translate-x-2 group">
                <div className="p-3 rounded-full bg-black border border-purple-500 group-hover:bg-purple-500/20 transition-all duration-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-purple-500"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </div>
                <span className="font-[JazzFont] tracking-wider text-white group-hover:text-purple-400 transition-colors text-lg">LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;