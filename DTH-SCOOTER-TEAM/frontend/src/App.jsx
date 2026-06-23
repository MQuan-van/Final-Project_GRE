// import { Suspense, lazy } from "react";
// import { AnimatePresence, LayoutGroup } from "framer-motion";
// import {
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";

// import Home from "./pages/Home";
// import Welcome from "./pages/Welcome";
// import Gallery from "./pages/Gallery";

// // Lazy load Story: trang này import Three.js/React Three Fiber (~900KB),
// // chỉ Story mới cần tới thư viện 3D đó. React.lazy() báo cho Vite tách
// // Story (và toàn bộ Three.js bên trong) ra thành 1 file JS riêng, chỉ
// // thực sự tải về khi người dùng điều hướng tới /story — Welcome/Home/Gallery
// // không còn phải tải nặng oan dù chưa bao giờ vào Story.
// const Story = lazy(() => import("./pages/Story"));

// function App() {
//   const location = useLocation();

//   return (
//     <LayoutGroup>
//       <AnimatePresence mode="wait">
//         <Routes
//           location={location}
//           key={location.pathname}
//         >
//           <Route path="/" element={<Welcome />} />
//           <Route path="/Home" element={<Home />} />
//           {/* <Route path="/gallery/:id" element={<Gallery />} /> */}
//           <Route path="/gallery/:slug" element={<Gallery />} />
//           <Route
//             path="/story"
//             element={
//               // Suspense fallback: hiện trong lúc file Story.js (+ Three.js)
//               // đang được tải về — chỉ xảy ra ở lần đầu vào /story, các lần
//               // sau trình duyệt đã cache nên tải lại tức thời.
//               <Suspense fallback={null}>
//                 <Story />
//               </Suspense>
//             }
//           />
//         </Routes>
//       </AnimatePresence>
//     </LayoutGroup>
//   );
// }

// export default App;
import { Suspense, lazy } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Gallery from "./pages/Gallery";
import StoryLoading from "./components/StoryLoading.jsx";

const Story = lazy(() => import("./pages/Story"));

function App() {
  const location = useLocation();

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          <Route
            path="/"
            element={
              <Suspense fallback={<StoryLoading />}>
                <Story />
              </Suspense>
            }
          />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/gallery/:slug" element={<Gallery />} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  );
}

export default App;