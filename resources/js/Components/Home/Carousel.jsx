import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';


function Carousel() {
    const [contents, setContents] = useState([]);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchContents = () => {
        axios.get('/api/contents')
            .then((response) => {
                setContents(response.data);
            })
            .catch((error) => {
                console.error('Error fetching contents:', error);
            });
            
    };

    useEffect(() => {
        fetchContents();
    }, []);

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
                loop={true}
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                  }}
                thumbs={{ swiper: thumbsSwiper }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update active index
                modules={[Autoplay, FreeMode, Navigation, Thumbs]}
                className="h-[50vh] w-full"
            >
                {contents.map((content, index) => (
                    <SwiperSlide key={index}>
                        <img
                            className="block w-full h-full object-cover"
                            src={`/storage/public/${content.image}`}
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
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}                freeMode={true}
                watchSlidesProgress={true}
                modules={[Autoplay, FreeMode, Navigation, Thumbs]}
                className="h-[20vh] border px-[10px]"
            >
                {contents.map((content, index) => (
                    <SwiperSlide key={index}>
                        <img
                            className={`w-full h-full object-cover transition-opacity duration-300 ${index === activeIndex ? "opacity-100" : "opacity-50"
                                }`}
                            src={`/storage/public/${content.image}`}
                            alt={`Thumbnail ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Carousel