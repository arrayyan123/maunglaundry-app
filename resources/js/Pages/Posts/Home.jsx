import Footer from '@/Components/Footer/Footer'
import AboutSection from '@/Components/Home/AboutSection'
import Carousel from '@/Components/Home/Carousel'
import ContentSection from '@/Components/Home/ContentSection'
import Hero from '@/Components/Home/Hero'
import MarqueeWrapper from '@/Components/Home/MarqueeWrapper'
import Navbar from '@/Components/Navbar/Navbar'
import { Head } from '@inertiajs/react'
import React, { useRef } from 'react'

function Home() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);

  const scrollToSection = (ref, event) => {
    event.preventDefault();
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("Ref not found:", ref);
    }
  };

  return (
    <div>
      <Head title="Home" />
      <Navbar
        homeRef={homeRef}
        aboutRef={aboutRef}
        servicesRef={servicesRef}
        scrollToSection={scrollToSection}
      />
      <Hero homeRef={homeRef} />
      <MarqueeWrapper />
      <Carousel />
      <AboutSection aboutRef={aboutRef} />
      <ContentSection servicesRef={servicesRef} />
      <Footer
        homeRef={homeRef}
        aboutRef={aboutRef}
        servicesRef={servicesRef}
        scrollToSection={scrollToSection}
      />
    </div>
  )
}

export default Home