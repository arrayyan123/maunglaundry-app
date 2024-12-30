import Footer from '@/Components/Footer/Footer'
import AboutSection from '@/Components/Home/AboutSection'
import Carousel from '@/Components/Home/Carousel'
import ContentSection from '@/Components/Home/ContentSection'
import Hero from '@/Components/Home/Hero'
import MarqueeWrapper from '@/Components/Home/MarqueeWrapper'
import Navbar from '@/Components/Navbar/Navbar'
import { Head } from '@inertiajs/react'
import React, { useRef, useState, useEffect } from 'react'

function Home() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contentRef = useRef(null);

  const [isContentSelected, setIsContentSelected] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const handleContentSelect = (contents) => {
    setIsContentSelected(true);
    setSelectedContent(contents);
  };

  const handleContentDeselect = () => {
    setIsContentSelected(false);
    setSelectedContent(null);
  };


  const scrollToSection = (ref, event, offset = 0) => {
    event?.preventDefault();
    if (ref && ref.current) {
      const elementPosition = ref.current.offsetTop;
      const offsetPosition = elementPosition + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      console.warn('Ref not found:', ref);
    }
  };

  useEffect(() => {
    if (isContentSelected && contentRef.current) {
      scrollToSection(contentRef, null, -80);
    }
  }, [isContentSelected]);

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
      <ContentSection
        contentRef={contentRef}
        servicesRef={servicesRef}
        scrollToSection={scrollToSection}
        isContentSelected={isContentSelected}
        selectedContent={selectedContent}
        onContentSelect={handleContentSelect}
        onContentDeselect={handleContentDeselect}
      />
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