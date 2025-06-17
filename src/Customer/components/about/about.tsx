import Mission from "../../../assets/mission.png";
import visionHover from "../../../assets/visionHover.png";
import missionHover from "../../../assets/missionHover.png";
import vision from "../../../assets/vission.png";
import thumb from "../../../assets/thumb.png";
import location from "../../../assets/Group.png";
import speed from "../../../assets/speed.png";
import { useState } from "react";

const About = () => {
  const [image1, setImage1] = useState(true);
  const [image2, setImage2] = useState(true);

  const toggleImage1 = () => setImage1((prev) => !prev);
  const toggleImage2 = () => setImage2((prev) => !prev);

  const handleMouseEnterImage1 = toggleImage1;
  const handleMouseEnterImage2 = toggleImage2;
  const handleMouseLeaveImage1 = toggleImage1;
  const handleMouseLeaveImage2 = toggleImage2;

  return (
    <>
      <section className="mt-5 md:flex gap-5" id="about">
        <aside className="flex-1 p-5">
          <div>
            <h2 className="text-3xl text-primary font-orbitron font-bold my-5">
              About Zip Logistics
            </h2>
            <p className="text-gray-800 text-sm mb-5">
              Zip Logistics is a leading logistics company dedicated to
              providing seamless and reliable delivery services.
            </p>
          </div>
          <div className="flex gap-5 md:gap-10 items-center md:justify-center">
            <img
              src={image1 ? Mission : missionHover}
              alt="Zip Logistics Mission"
              title="Zip Logistics Mission"
              className="md:w-1/3"
              onMouseEnter={handleMouseEnterImage1}
              onMouseLeave={handleMouseLeaveImage1}
            />
            <img
              src={image2 ? vision : visionHover}
              alt="Zip Logistics Vision"
              title="Zip Logistics Vision"
              className="md:w-1/3"
              onMouseEnter={handleMouseEnterImage2}
              onMouseLeave={handleMouseLeaveImage2}
            />
          </div>
        </aside>

        <aside className="flex-1 p-5">
          <div>
            <h2 className="text-primary font-open-sans font- text-xl mb-3">
              Why Work With Us ?
            </h2>
            <p className="mb-3 text-sm">
              We're more than just a delivery service--we're a trusted logistics
              partner.
            </p>
            <p className="mb-3 text-sm">
              Here's why our client rely on us for all their shipping needs
            </p>
          </div>

          <section className="grid gap-5">
            <div>
              <div className="flex items-center gap-5">
                {/* <CachedTwoToneIcon /> */}
                <div className="bg-primary p-2 rounded-full">
                  <img src={speed} alt="thumb" />
                </div>
                <h2 className="font-bold">Speed and Efficiency</h2>
              </div>
              <p className="text-sm ml-12 mt-2">
                We understand that time is money. That’s why we offer
                lightning-fast delivery options, ensuring your shipments reach
                their destinations on time, every time.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-5">
                <div className="bg-primary p-2 rounded-full">
                  <img src={thumb} alt="thumb" />
                </div>
                <h2 className="font-bold">Unmatched Reliability</h2>
              </div>
              <p className="text-sm ml-12 mt-2">
                With Zip Logistics, you can trust that your packages are in safe
                hands. We pride ourselves on our impeccable delivery success
                rate, ensuring that your goods are handled with care and
                precision from pickup to delivery.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-5">
                <div className="bg-primary p-2 rounded-full">
                  <img src={location} alt="location" />
                </div>
                <h2 className="font-bold">Unmatched Reliability</h2>
              </div>
              <p className="text-sm ml-12 mt-2">
                Stay informed every step of the way with our real-time tracking
                system. Whether you’re sending a small package or a large
                shipment, our advanced technology allows you to monitor your
                delivery 24/7, so you always know where your package is and when
                it will arrive.
              </p>
            </div>
          </section>
        </aside>
      </section>
    </>
  );
};

export default About;
