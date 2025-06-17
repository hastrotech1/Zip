import React from "react";
import Footer from "./Footer/Footer";
import Contact from "./Contact/Contact";
import HeroBanner from "./Header/HeroBanner";
import MobileHeader from "./Header/MobileHeader";
import Header from "./Header/Header";
import SubHero from "./subHero/subHero";
import About from "./about/about";
import Testimonials from "./Testimonials/Testimonials";
// import Service from './services/Service';
// import ShipmentTracking from './shipmentTracking/';

const Home: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r  from-[#000715] from-40%  to-[#0A1172] to-100%">
        {/* <Header /> */}
        <div className="md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:block">
          <Header />
        </div>
        <HeroBanner />
      </div>
      <SubHero />
      <About />
      {/* <Service /> */}
      {/* <TrackShipment /> */}
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
};
export default Home;
