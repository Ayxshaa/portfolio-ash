import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainContent from "./MainContent";
import Gallery from "./components/UI/Gallery";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}
