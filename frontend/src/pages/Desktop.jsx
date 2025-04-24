import { useState } from "react";
import { NewsProvider } from "../service/NewsContext";
import { useAuth} from '../service/AuthContext';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import Component1 from "../components/Header";
import FOOTERBUT from "../components/footer/Footer_but";
import CLOSEBUT from "../components/footer/Close_But";
import FrameComponent1 from "../components/Right_Block/FrameComponent1";
import RevolutionBanner from "../components/RevolutionBanner";
import Sidebar from "../components/footer/Sidebar";
import "./Desktop.css";
import NewsByCategory from "../components/NewsByCategory";

function Desktop() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleToggle = (newState) => {
    setSidebarOpen(newState);
  };

  const handleClose = () => {
    setSidebarOpen(false);
  };

  return (
    <NewsProvider>
      <div className="desktop-1">
        <Component1 property1="Variant2" />
        
        <FOOTERBUT onToggle={handleToggle} isMenuOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} onClose={handleClose}>
          <CLOSEBUT onToggle={handleClose} className="sidebar-close" />
        </Sidebar>
  
        <main className="frame-parent">
          <Swiper
            slidesPerView={3}
            spaceBetween={50}
            speed={7000}
            autoplay={{
              delay: 1,
              disableOnInteraction: true,
            }}
            loop={true}
            freeMode={true}
            modules={[Autoplay, FreeMode]}
            className="mySwiper"
          >
            <SwiperSlide>
              <a href="https://www.bbc.com"><img style={{ width: "150px", marginTop: "-30px" }} src="../../../public/bbc_news_logo.png" className="slider-el" alt="" /></a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="https://www.cnn.com"><img style={{ width: "140px" }} src="../../../public/CNN_Logo.png" className="slider-el" alt="" /></a>
            </SwiperSlide>
            <SwiperSlide>
              <img style={{ width: "220px", marginTop: "-20px" }} src="../../../public/The-New-York-Times.png" className="slider-el" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <a className="slider-el" href="https://www.bloomberg.com/"><img style={{ width: "180px", marginTop: "-20px" }} src="../../../public/Bloomberg-Logo.png" className="slider-el" alt="" /></a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="https://www.forbes.com/"><img style={{ width: "120px", marginTop: "-22px" }} src="../../../public/forbes.png" className="slider-el" alt="" /></a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="https://tengrinews.kz/"><img style={{ width: "210px", marginTop: "22px" }} src="../../../public/Tengrinews-logo.png" className="slider-el" alt="" /></a>
            </SwiperSlide>
          </Swiper>

          <FrameComponent1 />
          <RevolutionBanner />
          <NewsByCategory />
        </main>
      </div>
    </NewsProvider>
  );
}

export default Desktop;