import React, { useState, useEffect } from 'react'

function ContentItem({ title, text1, text2, image1, image2, isImageLeft }) {
  return (
    <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
      {isImageLeft ? (
        <>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <img className="w-full rounded-lg" src={image1} alt="content image 1" />
            <img className="mt-4 w-full lg:mt-10 rounded-lg" src={image2} alt="content image 2" />
          </div>
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
            <p className="mb-4">{text1}</p>
            <p>{text2}</p>
          </div>
        </>
      ) : (
        <>
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
            <p className="mb-4">{text1}</p>
            <p>{text2}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <img className="w-full rounded-lg" src={image1} alt="content image 1" />
            <img className="mt-4 w-full lg:mt-10 rounded-lg" src={image2} alt="content image 2" />
          </div>
        </>
      )}
    </div>
  )
}

function ContentSection() {
  const contentData = [
    {
      title: "We didn't reinvent the wheel",
      text1: "We are strategists, designers and developers. Innovators and problem solvers...",
      text2: "Small enough to be simple and quick.",
      image1: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png",
      image2: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png",
    },
    {
      title: "Innovating for the future",
      text1: "Our team combines expertise with creativity to bring unique solutions.",
      text2: "We adapt and evolve with technology.",
      image1: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png",
      image2: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png",
    },
    {
      title: "Driving change in the industry",
      text1: "We push boundaries to create meaningful solutions.",
      text2: "Our focus is on quality and long-term impact.",
      image1: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png",
      image2: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png",
    },
    {
      title: "Leading with integrity",
      text1: "Our commitment to excellence guides every project.",
      text2: "We value transparency and reliability.",
      image1: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png",
      image2: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png",
    },
  ]

  const [isImageLeftArray, setIsImageLeftArray] = useState([])

  useEffect(() => {
    let lastPosition = false
    const positions = contentData.map(() => {
      const isImageLeft = !lastPosition 
      lastPosition = isImageLeft
      return isImageLeft
    })
    setIsImageLeftArray(positions)
  }, [])

  return (
    <section className="bg-white dark:bg-gray-900 p-20">
      {contentData.map((content, index) => (
        <ContentItem
          key={index}
          title={content.title}
          text1={content.text1}
          text2={content.text2}
          image1={content.image1}
          image2={content.image2}
          isImageLeft={isImageLeftArray[index]}
        />
      ))}
    </section>
  )
}

export default ContentSection
