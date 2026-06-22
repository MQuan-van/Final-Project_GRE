import { AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Gallery from "./pages/Gallery";
import Story from "./pages/Story";

function App() {
  const location = useLocation();

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          <Route path="/" element={<Welcome />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/gallery/:id" element={<Gallery />} />
          <Route path="/story" element={<Story />} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export default App;