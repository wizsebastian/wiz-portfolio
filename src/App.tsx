import { BrowserRouter, Routes, Route } from "react-router-dom";
import PixelPortfolio from "./components/PixelPortfolio";
import ProjectsPage from "./components/ProjectsPage";
import UnderConstruction from "./components/UnderConstruction";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PixelPortfolio />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
