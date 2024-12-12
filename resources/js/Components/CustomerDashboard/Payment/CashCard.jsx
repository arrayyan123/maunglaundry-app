import React from 'react';

function CashCard() {
  return (
    <div className="p-4">
      <h1 className="text-[25px] font-bold mb-4">Cash</h1>
      <p className="mb-6">Harap mengunjungi toko kami untuk pembayarannya.</p>
      <div className="relative bg-white shadow-lg rounded-md overflow-hidden">
        <iframe
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=maung%20laundry&zoom=18&maptype=roadmap"
          title="Lokasi Toko"
        ></iframe>
      </div>
    </div>
  );
}

export default CashCard;
