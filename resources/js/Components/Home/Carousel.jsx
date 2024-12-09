import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';


function Carousel() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0); // State untuk melacak slide aktif

    return (
        <div className='bg-gray-900'>
            {/* //swiper 1 */}
            <Swiper
                style={{
                    "--swiper-navigation-color": "#000",
                    "--swiper-pagination-color": "#000",
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update active index
                modules={[FreeMode, Navigation, Thumbs]}
                className="h-[50vh] w-full"
            >
                {[
                    "https://swiperjs.com/demos/images/nature-1.jpg",
                    "https://swiperjs.com/demos/images/nature-2.jpg",
                    "https://swiperjs.com/demos/images/nature-3.jpg",
                    "https://swiperjs.com/demos/images/nature-4.jpg",
                    "https://swiperjs.com/demos/images/nature-5.jpg",
                    "https://swiperjs.com/demos/images/nature-6.jpg",
                    "https://swiperjs.com/demos/images/nature-7.jpg",

                ].map((src, index) => (
                    <SwiperSlide key={index}>
                        <img
                            className="block w-full h-full object-cover"
                            src={src}
                            alt={`Slide ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* //swiper 2 */}
            <Swiper
                onSwiper={setThumbsSwiper}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update active index saat slide berubah
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="h-[20vh] border px-[10px]"
            >
                {[
                    "https://swiperjs.com/demos/images/nature-1.jpg",
                    "https://swiperjs.com/demos/images/nature-2.jpg",
                    "https://swiperjs.com/demos/images/nature-3.jpg",
                    "https://swiperjs.com/demos/images/nature-4.jpg",
                    "https://swiperjs.com/demos/images/nature-5.jpg",
                    "https://swiperjs.com/demos/images/nature-6.jpg",
                    "https://swiperjs.com/demos/images/nature-7.jpg",
                ].map((src, index) => (
                    <SwiperSlide key={index}>
                        <img
                            className={`w-full h-full object-cover transition-opacity duration-300 ${index === activeIndex ? "opacity-100" : "opacity-50"
                                }`}
                            src={src}
                            alt={`Thumbnail ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Carousel