import React from "react";
import { motion } from "framer-motion";
import Button from "./Button"; // Import your custom Button

const mediaItems = [
  { src: "/Gallery/first.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/goldie.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/eleventh.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/rosie.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/sixteen.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/second.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/third.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/fifth.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/sixth.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/fifteen.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/seventh.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/eighth.jpg", size: "col-span-1 row-span-1" },
  { src: "/Gallery/thirteen.jpg", size: "col-span-1 row-span-2" },
  { src: "/Gallery/fourth.jpg", size: "col-span-1 row-span-1" },
];

const Gallery = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center py-10">
      {/* Back Button and Title Row */}
      <div className="flex items-center justify-center w-full max-w-5xl px-4">
        {/* Back Button using Custom Button Component */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Button
            variant="secondary"
            size="medium"
            className="mr-4"
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>
        </motion.div>

        {/* Title with Animation */}
        <motion.h2
          className="text-gray-500 font-[JazzFont] text-xl md:text-xl font-semibold text-center flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Not a photographer, just the world from my eyes 🤍📸
        </motion.h2>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 max-w-5xl">
        {mediaItems.map((item, index) => (
          <motion.div
            key={index}
            className={`relative rounded-lg overflow-hidden ${item.size} flex items-center`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img
              src={item.src}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110 hover:shadow-lg"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
