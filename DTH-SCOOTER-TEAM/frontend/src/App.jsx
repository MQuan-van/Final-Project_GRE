import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery/:id" element={<Gallery />} />
    </Routes>
  );
}

export default App;
