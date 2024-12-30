import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Fade } from 'react-awesome-reveal';

function ContentSection({ contentRef, servicesRef, isContentSelected, selectedContent, onContentSelect, onContentDeselect, scrollToSection }) {
  const [contents, setContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [modalImage, setModalImage] = useState(null);

  const openModal = (imagePath) => {
    setModalImage(imagePath);
  };

  const closeModal = () => {
    setModalImage(null);
  };

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
    const interval = setInterval(fetchContents, 10000);
    fetchContents();
    return () => clearInterval(interval);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContents = contents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(contents.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section ref={servicesRef} className="bg-white dark:bg-gray-900 md:p-20 p-6">
      <div ref={contentRef} className='mb-5'>
        <h1 className='text-black text-[30px] font-bold text-center'>Berita Terkini</h1>
      </div>
      {!isContentSelected && (
        <div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {currentContents.map((item) => (
              <article
                key={item.id}
                className="flex flex-col motion-preset-shrink dark:bg-gray-50 cursor-pointer"
                onClick={(e) => {
                  onContentSelect(item);
                  scrollToSection(contentRef, e);
                }}
              >
                <a
                  rel="noopener noreferrer"
                  className='relative'
                  href="#"
                  aria-label={`Buka blog ${item.title}`}
                >
                  <img
                    alt={item.title}
                    className="object-cover w-full h-52 dark:bg-gray-500 transition duration-200 hover:scale-110"
                    src={`/storage/${item.images?.[0]?.path}`}
                  />
                </a>
                <div className="flex flex-col flex-1 p-6">
                  <div className='relative text-black hover:font-bold cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-black before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-black after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%] mb-2'>
                    <span className="text-xl font-bold leading-tight mb-2">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-gray-600">
                    <span>
                      {moment(item.created_at).format('MMMM Do, YYYY, h:mm A')}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {isContentSelected && selectedContent && (
        <div
          className="lg:p-6 p-2 bg-white shadow-md dark:bg-gray-50">
          <button
            onClick={(e) => {
              onContentDeselect();
              scrollToSection(servicesRef, e, -80);
            }}
            className="mb-4 px-3 py-4 bg-red-500 text-sm text-white rounded-xl"
          >
            <div 
              className='relative text-white hover:font-bold cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-white before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-white after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]'>
              <span>
                Kembali ke daftar blog
              </span>
            </div>
          </button>
          <h2 className="text-2xl text-black font-bold mb-4">{selectedContent.title}</h2>
          <p className="my-4 text-sm text-gray-600">
            Dipublikasikan pada: {moment(selectedContent.created_at).format('MMMM Do, YYYY, h:mm A')}
          </p>
          <img
            src={`/storage/${selectedContent.images?.[0]?.path}`}
            alt={selectedContent.title}
            className="object-cover object-center w-full h-80"
          />
          <div className="space-y-6 mt-4">
            {(() => {
              const paragraphs = selectedContent.description.split('\n\n');
              const images = selectedContent.images || [];

              return Array.from({ length: Math.max(paragraphs.length, images.length) }).map((_, i) => (
                <React.Fragment key={i}>
                  {i < paragraphs.length && (
                    <div
                      className="prose prose-sm text-black max-w-none"
                      dangerouslySetInnerHTML={{ __html: paragraphs[i] }}
                    />
                  )}
                </React.Fragment>
              ));
            })()}
          </div>
          <div className="bg-white dark:bg-gray-800  h-full py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
                <div className="flex items-center gap-12">
                  <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">Gallery</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 xl:gap-8">
                {selectedContent.images && selectedContent.images.map((image, index) => {
                  const isFirstInRow = (Math.floor(index / 2) % 2 === 0); // Menentukan pola selang-seling berdasarkan baris
                  const isLeftImage = index % 2 === 0; // Menentukan gambar kiri (kecil) dan kanan (besar)
                  return (
                    <a
                      key={index}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openModal(`/storage/${image.path}`);
                      }}
                      className={`group relative flex items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg ${isFirstInRow
                        ? isLeftImage
                          ? 'h-80'
                          : 'md:col-span-2 col-span-1 h-80'
                        : isLeftImage
                          ? 'md:col-span-2 col-span-1 h-80'
                          : 'h-80'
                        }`}
                    >
                      <img
                        src={`/storage/${image.path}`}
                        loading="lazy"
                        alt={`Gallery Image ${index + 1}`}
                        className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

                      <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
                        {image.title || 'foto'}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
            {modalImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                onClick={closeModal}
              >
                <div className="relative">
                  <img
                    src={modalImage}
                    alt="Preview"
                    className="max-w-[90vw] motion-preset-blur-up mx-auto max-h-[90vh] object-contain bg-white"
                  />
                  <p className='text-white mx-3'>{selectedContent.title}</p>
                  <button
                    className="absolute top-0 md:block hidden right-0 p-4 text-white text-3xl"
                    onClick={closeModal}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ContentSection;