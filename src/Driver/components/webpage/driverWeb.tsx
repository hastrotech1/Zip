import Features from "./features/Features";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import HowItWorks from "./Work/HowItWorks";
import JoinTeam from "./Team/joinTeam";
import HeroSection from "./Hero/heroSection";

const DriverWeb: React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <HowItWorks />
      <JoinTeam />
      <Footer />
    </>
  );
};
export default DriverWeb;
