import { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import CustomFallback from "./components/UI/CustomFallBack";

const Loader = lazy(() => import("./components/UI/Loader"));
const Layout = lazy(() => import("./Layout"));
const MainContent = lazy(() => import("./MainContent"));
const Gallery = lazy(() => import("./components/UI/Gallery"));

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
