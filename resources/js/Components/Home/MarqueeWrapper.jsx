import React from 'react';
import Marquee from 'react-fast-marquee';

const MarqueeWrapper = () => {
  const marqueeText = "Maung Laundry";
  const textArray = new Array(8).fill(marqueeText);

  return (
    <>
        <div className="mt-0">
            <div className="">
                <Marquee className="h-[60px] bg-gray-900">
                    {textArray.map((text, index) => (
                    <span key={index} className="mx-5 font-outline-2 text-[23px] text-white font-bold">
                        {text}
                    </span>
                    ))}
                </Marquee>
            </div>
        </div>
    </>
  );
};

export default MarqueeWrapper;
