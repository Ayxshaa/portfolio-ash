import React from "react";
import About from "./About";
import Myself from "./Myself";

const AboutMe = () => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      {/* First - Myself Section */}
      <div className="w-full flex justify-center items-center">
        <Myself />
      </div>

      {/* Second - About Section */}
      <div className="w-full flex justify-center items-center">
        <About />
      </div>
    </section>
  );
};

export default AboutMe;
