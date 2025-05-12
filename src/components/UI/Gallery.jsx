import React from "react";
import { motion } from "framer-motion";
import Button from "./Button"; // Your custom Button

const mediaItems = [
  { src: "/Gallery/first.jpg" },
  { src: "/Gallery/goldie.jpg" },
  { src: "/Gallery/eleventh.jpg" },
  { src: "/Gallery/rosie.jpg" },
  { src: "/Gallery/sixteen.jpg" },
  { src: "/Gallery/second.jpg" },
  { src: "/Gallery/third.jpg" },
  { src: "/Gallery/fifth.jpg" },
  { src: "/Gallery/sixth.jpg" },
  { src: "/Gallery/fifteen.jpg" },
  { src: "/Gallery/seventh.jpg" },
  { src: "/Gallery/eighth.jpg" },
  { src: "/Gallery/thirteen.jpg" },
  { src: "/Gallery/fourth.jpg" },
  {src: "/Gallery/jacky.jpg" },
];

const Gallery = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center py-10">
      {/* Back Button and Title */}
      <div className="flex items-center justify-center w-full max-w-6xl px-4 mb-6">
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

        <motion.h2
          className="text-gray-500 font-[JazzFont] text-xl md:text-xl font-semibold text-center flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Not a photographer, just the world from my eyes 🤍📸
        </motion.h2>
      </div>

      {/* Masonry Style Grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-4 px-4 max-w-5xl">
  {mediaItems.map((item, index) => (
    <motion.div
      key={index}
      className="mb-4 break-inside-avoid overflow-hidden rounded-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <img
        src={item.src}
        alt={`Gallery ${index + 1}`}
        className="w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        style={{ maxHeight: "250px", objectFit: "cover" }} // make them smaller
      />
    </motion.div>
  ))}
</div>

    </div>
  );
};

export default Gallery;
