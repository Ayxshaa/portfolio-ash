import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function SmoothScroll({ children }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    // Expose to window so Gallery can access it
    window.locomotiveScroll = scroll;

    return () => {
      scroll.destroy();
      window.locomotiveScroll = null;
    };
  }, []);

  return (
    <div id="scroll-container" data-scroll-container ref={scrollRef}>
      {children}
    </div>
  );
}
