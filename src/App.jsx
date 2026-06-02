import { useLocation } from "react-router-dom";
import { isMobile, isTablet } from "react-device-detect";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layout/Footer";

function App() {
  const location = useLocation();

  if (isMobile || isTablet) {
    return (
      <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Desktop Only
          </h1>
          <p className="text-gray-400">
            ViewGasm is currently available only on desktop devices.
            Please visit using a laptop or desktop computer.
          </p>
        </div>
      </div>
    );
  }

  const hiddenRoutes = ["/watch", "/player", "/detail"];
  const shouldHide = hiddenRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#060608] text-white selection:bg-[#ff0000]/30 selection:text-white">
      <div className="flex-grow">
        <AppRoutes />
      </div>
      {!shouldHide && <Footer />}
    </div>
  );
}

export default App;