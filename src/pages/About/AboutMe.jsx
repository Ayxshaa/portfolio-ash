import React from "react";
import About from "./About";
import Myself from "./Myself";

const AboutMe = () => {
  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-black text-white p-6">
      {/* Left Side - About Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <About />
      </div>

      {/* Right Side - Myself Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Myself />
      </div>
    </section>
  );
};

export default AboutMe;
