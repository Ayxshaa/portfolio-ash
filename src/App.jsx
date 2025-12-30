import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazyWithPreload } from "./utils/lazywithPreload";
import CustomFallback from "./components/UI/CustomFallBack";
import SmoothScroll from "./components/SmoothScroll";

const Loader = React.lazy(() => import("./components/UI/Loader"));
const Layout = React.lazy(() => import("./Layout"));
const MainContent = React.lazy(() => import("./MainContent"));
const Gallery = lazyWithPreload(() => import("./components/UI/Gallery"));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <style>{`
        .Toastify__toast--success {
          background-color: #704995 !important;
          font-family: 'JazzFont', sans-serif !important;
          letter-spacing: 0.05em;
          color: white !important;
        }
        .Toastify__toast-body {
          font-family: 'JazzFont', sans-serif !important;
          letter-spacing: 0.05em;
          color: white !important;
        }
        .Toastify__toast {
          font-family: 'JazzFont', sans-serif !important;
          color: white !important;
        }
        .Toastify__toast--success .Toastify__toast-icon {
          color: #999999 !important;
        }
        .Toastify__toast--success .Toastify__toast-icon svg {
          fill: #999999 !important;
        }
        .Toastify__toast--success {
          border-left: 4px solid #999999 !important;
        }
      `}</style>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      {isLoading ? (
        <Suspense fallback={<CustomFallback />}>
          <Loader onComplete={() => setIsLoading(false)} />
        </Suspense>
      ) : (
        <Router>
          <Suspense fallback={<CustomFallback />}>

            <nav>
              <Link
                to="/gallery"
                onMouseEnter={() => Gallery.preload()}
              ></Link>
            </nav>

            <Routes>
              <Route element={<Layout />}>

                {/* ❌ No Locomotive on MainContent (fixes 200% zoom) */}
                <Route path="/" element={<MainContent />} />

                {/* ✔ Locomotive only on Gallery page */}
                <Route
                  path="/gallery"
                  element={
                    <SmoothScroll>
                      <Gallery />
                    </SmoothScroll>
                  }
                />

              </Route>
            </Routes>

          </Suspense>
        </Router>
      )}
    </>
  );
}