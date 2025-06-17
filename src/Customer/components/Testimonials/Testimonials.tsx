import React, { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  name: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    text: "Zip Logistics made shipping my products overseas a breeze.",
  },
  {
    id: 13,
    name: "Alice Johnson",
    text: "Exceptional service and support!",
  },
  {
    id: 14,
    name: "Bob Brown",
    text: "Quick and efficient delivery every time.",
  },
  {
    id: 15,
    name: "Charlie Davis",
    text: "The best logistics company I have ever used.",
  },
  {
    id: 16,
    name: "Diana Evans",
    text: "Reliable and trustworthy service.",
  },
  {
    id: 17,
    name: "Ethan Foster",
    text: "Great customer service and fast shipping.",
  },
  {
    id: 18,
    name: "Fiona Green",
    text: "I am very satisfied with their service.",
  },
  {
    id: 19,
    name: "George Harris",
    text: "They always deliver on time.",
  },
  {
    id: 20,
    name: "Hannah Irving",
    text: "Fantastic experience from start to finish.",
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const updateItemsPerPage = () => {
    if (window.innerWidth >= 768) {
      setItemsPerPage(2);
    } else {
      setItemsPerPage(1);
    }
  };

  const nextTestimonial = React.useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + itemsPerPage) % testimonials.length
    );
  }, [itemsPerPage]);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const prevTestimonial = React.useCallback(() => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - itemsPerPage + testimonials.length) % testimonials.length
    );
  }, [itemsPerPage]);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 3500); // Change testimonial every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [nextTestimonial]);

  return (
    <div className="mt-10 mb-10 px-2 md:px-14">
      <h1 className="text-blue-950 font-black text-4xl md:text-7xl">
        Testimonials
      </h1>
      <h2 className="text-xl font-bold my-4 md:text-3xl md:mb-10">
        What Our Customers Are Saying
      </h2>
      <div className="relative w-full overflow-hidden">
        <div
          className="flex md:gap-4  transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative min-w-full bg-white min-h-[200px] border-4 rounded-lg border-blue-900  grid place-content-center text-center"
            >
              <p className="text-3xl italic mb-4">{testimonial.text}</p>
              <h4 className="text-bold text-2xl font-semibold">
                {testimonial.name}
              </h4>
              <button
                onClick={prevTestimonial}
                className="absolute top-2  left-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Previous
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute bottom-2  right-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mt-4"></div>
    </div>
  );
};

export default Testimonials;
