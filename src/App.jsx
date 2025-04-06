import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/UI/Loader"; // make sure the path is correct
import MainContent from "./MainContent";
import Gallery from "./components/UI/Gallery";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </Router>
      )}
    </>
  );
}
