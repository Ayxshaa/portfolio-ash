import { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
const Loader = lazy(() => import("./components/UI/Loader"));
const Layout = lazy(() => import("./Layout")); // Import the new Layout component
const MainContent = lazy(() => import("./MainContent"));
const Gallery = lazy(() => import("./components/UI/Gallery"));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Loader onComplete={() => setIsLoading(false)} />
        </Suspense>
      ) : (
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
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
