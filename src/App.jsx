import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { lazyWithPreload } from "./utils/lazywithPreload";
import CustomFallback from "./components/UI/CustomFallBack";

const Loader = React.lazy(() => import("./components/UI/Loader"));
const Layout = React.lazy(() => import("./Layout"));
const MainContent = React.lazy(() => import("./MainContent"));
const Gallery = lazyWithPreload(() => import("./components/UI/Gallery"));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Suspense fallback={<CustomFallback />}>
          <Loader onComplete={() => setIsLoading(false)} />
        </Suspense>
      ) : (
        <Router>
          <Suspense fallback={<CustomFallback />}>
            <nav >
              <Link
                to="/gallery"
                onMouseEnter={() => {
                  Gallery.preload(); // Preload Gallery on hover
                }}
              >
              </Link> 
            </nav>

            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<MainContent />} />
                <Route path="/gallery" element={<Gallery />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      )}
    </>
  );
}
