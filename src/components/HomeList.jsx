import Home from "../pages/Home";
import About from "./About";
import FeaturedCars from "./FeaturedCars";
import MapSection from "./MapSection";
import Testimonial from "./Testimonial";
import WhyChooseUs from "./WhyChooseUs";
import Marquee from "./Marquee";



function HomeList () {
    return(
        <div>
            <Home />
            <FeaturedCars />
            <About />
            <WhyChooseUs />
            <Testimonial />
            <MapSection />
            <Marquee />
        </div>
  
    );
  } 
  export default HomeList;