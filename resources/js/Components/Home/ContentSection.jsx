import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponen individual untuk setiap item konten
function ContentItem({ title, description, image, isImageLeft }) {
  return (
    <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
      {isImageLeft ? (
        // Jika gambar di sebelah kiri
        <>
          <div className="grid grid-cols-1 gap-4 shadow-lg">
            <img className="w-full rounded-lg" src={`/storage/public/${image}`} alt={title} />
          </div>
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
            <div
              className="break-words text-black"
              dangerouslySetInnerHTML={{ __html: description }} 
            />          
          </div>
        </>
      ) : (
        <>
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
            <div
              className="break-words text-black"
              dangerouslySetInnerHTML={{ __html: description }} 
            />          
          </div>
          <div className="grid grid-cols-1 gap-4 shadow-lg">
            <img className="w-full rounded-lg" src={`/storage/public/${image}`} alt={title} />
          </div>
        </>
      )}
    </div>
  );
}

function ContentSection({servicesRef}) {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = () => {
      axios.get('/api/contents')
        .then((response) => {
          setContents(response.data);
        })
        .catch((error) => {
          console.error('Error fetching contents:', error);
        });
    };

    // Lakukan polling setiap 5 detik (5000 ms)
    const interval = setInterval(fetchContents, 5000);

    // Ambil data awal sekali ketika komponen di-mount
    fetchContents();

    // Bersihkan interval ketika komponen unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={servicesRef} className="bg-white dark:bg-gray-900 p-20">
      <div>
        <h1 className='text-black text-[30px] font-bold text-center'>Berita Terkini</h1>
      </div>
      {contents.map((content, index) => (
        <ContentItem
          key={content.id}
          title={content.title}
          description={content.description}
          image={content.image}
          isImageLeft={index % 2 === 0} // Gambar di kiri jika index genap
        />
      ))}
    </section>
  );
}

export default ContentSection;