import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Each slide has its own image, tag, heading and text.
// The background color stays the same for every slide, only the image and text change.
const slides = [
  {
    image: "/slide-1.jpg",
    tag: "New Arrival",
    heading: "First Slide Headline",
    text: "Short supporting text about the first offer goes here, describing what makes it worth checking out.",
    buttonText: "Shop Now",
  },
  {
    image: "/slide-2.png",
    tag: "Featured Product",
    heading: "Second Slide Headline",
    text: "Short supporting text about the second offer goes here, describing what makes it worth checking out.",
    buttonText: "Shop Now",
  },
  {
    image: "/slide-3.png",
    tag: "Limited Offer",
    heading: "Third Slide Headline",
    text: "Short supporting text about the third offer goes here, describing what makes it worth checking out.",
    buttonText: "Shop Now",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically move to the next slide every 4 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    // Clear the timer when the component unmounts, to avoid memory leaks.
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="w-full bg-blue-600 relative overflow-hidden">
      {/* Decorative circle blobs, similar to the reference design */}
      <div className="absolute -left-16 -top-24 w-72 h-72 bg-blue-500/40 rounded-full" />
      <div className="absolute right-10 -bottom-20 w-80 h-80 bg-blue-500/40 rounded-full" />
      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/30 rounded-full" />

      {/* Prev and next arrows, hidden on mobile since users can swipe/scroll by hand there */}
      <button
        onClick={goToPrevious}
        className="hidden md:block absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 shadow rounded-full p-2 z-10"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={goToNext}
        className="hidden md:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 shadow rounded-full p-2 z-10"
      >
        <ChevronRight size={18} />
      </button>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative overflow-hidden">
        <div className="grid md:grid-cols-2 items-center gap-8 py-12 md:py-16 min-h-[460px]">
          {/* Left side, text updates with the active slide */}
          <div>
            <p className="text-sm text-blue-100 mb-3">{activeSlide.tag}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {activeSlide.heading}
            </h2>
            <p className="text-blue-100 mb-6 max-w-md">{activeSlide.text}</p>
            <button className="bg-white hover:bg-slate-100 text-blue-700 px-6 py-3 rounded-md font-medium">
              {activeSlide.buttonText}
            </button>
          </div>

          {/* Right side, the full product image is shown here, nothing cropped */}
          <div className="flex justify-center items-center h-64 md:h-96">
            <img
              key={activeSlide.image}
              src={activeSlide.image}
              alt={activeSlide.heading}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Dot indicators, centered at the bottom, clicking a dot jumps straight to that slide */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-blue-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;