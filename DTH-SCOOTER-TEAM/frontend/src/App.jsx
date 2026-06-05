import { AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Gallery from "./pages/Gallery";

function App() {
  const location = useLocation();

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
            <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Home />} />
          <Route path="/gallery/:id" element={<Gallery />} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export default App;
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import { AnimatePresence } from "framer-motion";
// import Home from "./pages/Home";
// import Gallery from "./pages/Gallery";

// function AppRoutes() {
//   const location = useLocation();

//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<Home />} />
//         <Route path="/gallery/:id" element={<Gallery />} />
//       </Routes>
//     </AnimatePresence>
//   );
// }

// export default App; {