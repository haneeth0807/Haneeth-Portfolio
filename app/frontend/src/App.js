import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/theme";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Backdrop } from "@/components/Backdrop";
import { Cursor } from "@/components/Cursor";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Work from "@/pages/Work";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScroll />
        <div className="relative min-h-screen">
          <Backdrop />
          <Cursor />
          <Navbar />
          <div className="relative z-10">
            <AnimatedRoutes />
            <Footer />
          </div>
        </div>
        <Toaster position="bottom-right" theme="dark" toastOptions={{ style: { fontFamily: "Archivo Narrow", fontSize: 15 } }} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;