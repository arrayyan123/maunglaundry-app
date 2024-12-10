import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Fade } from 'react-awesome-reveal';


function ContentItem({ title, description, image, created_at, isImageLeft }) {
  const formattedDate = moment(created_at).format('MMMM Do, YYYY, h:mm A');

  return (
    <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
      {isImageLeft ? (
        <>
          <div className="grid grid-cols-1 gap-4 shadow-lg">
            <img className="w-full rounded-lg" src={`/storage/public/${image}`} alt={title} />
          </div>
          <div className="font-light md:mt-0 mt-4 text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 md:text-4xl text-xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
            <div
              className="break-words text-black"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <p>Dibuat pada: {formattedDate}</p>
          </div>
        </>
      ) : (
        <>
          <div className="font-light md:mb-0 mb-4 text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 md:text-4xl text-xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
            <div
              className="break-words text-black"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <p>Dibuat pada: {formattedDate}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 shadow-lg">
            <img className="w-full rounded-lg" src={`/storage/public/${image}`} alt={title} />
          </div>
        </>
      )}
    </div>
  );
}

function ContentSection({ servicesRef }) {
  const [contents, setContents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // Default showing 2 items

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

  const handleSeeMore = () => {
    setVisibleCount(contents.length); // Show all items
  };

  const handleSeeLess = () => {
    setVisibleCount(2); // Collapse back to 2 items
  };

  return (
    <section ref={servicesRef} className="bg-white dark:bg-gray-900 md:p-20 p-6">
      <div>
        <h1 className='text-black text-[30px] font-bold text-center'>Berita Terkini</h1>
      </div>
      {contents.slice(0, visibleCount).map((content, index) => (
        <Fade>
          <ContentItem
            key={content.id}
            title={content.title}
            description={content.description}
            created_at={content.created_at}
            image={content.image}
            isImageLeft={index % 2 === 0}
          />
        </Fade>
      ))}

      <div className="text-center mt-8">
        {visibleCount < contents.length ? (
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            See More
          </button>
        ) : (
          contents.length > 2 && (
            <button
              onClick={handleSeeLess}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
            >
              See Less
            </button>
          )
        )}
      </div>
    </section>
  );
}

export default ContentSection;