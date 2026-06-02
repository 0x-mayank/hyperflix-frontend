import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layout/Footer";

function App() {
  const location = useLocation();
  
  // Logic to hide footer on player/detail pages
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