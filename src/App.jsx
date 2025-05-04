import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/UI/Loader";
import Layout from "./Layout"; // Import the new Layout component
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
            <Route element={<Layout />}>
              <Route path="/" element={<MainContent />} />
              <Route path="/gallery" element={<Gallery />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
}