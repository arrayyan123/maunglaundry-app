import Footer from '@/Components/Footer/Footer'
import AboutSection from '@/Components/Home/AboutSection'
import Carousel from '@/Components/Home/Carousel'
import ContentSection from '@/Components/Home/ContentSection'
import Hero from '@/Components/Home/Hero'
import Geolocation from '@/Components/Geolocation'
import MarqueeWrapper from '@/Components/Home/MarqueeWrapper'
import Navbar from '@/Components/Navbar/Navbar'
import { Head } from '@inertiajs/react'
import React from 'react'
MarqueeWrapper

function Home() {
  return (
    <div>
        <Head title="Home" />
        <Navbar />
        <Hero />
        <Geolocation />
        <MarqueeWrapper />
        <AboutSection />
        <ContentSection />
        <Carousel />
        <Footer />
    </div>
  )
}

export default Home