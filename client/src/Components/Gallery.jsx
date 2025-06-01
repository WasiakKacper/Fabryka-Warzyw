import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Gallery = () => {
  const [images, setImages] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedCount === images.length && images.length > 0) {
      setIsLoaded(true);
    }
  }, [loadedCount, images]);

  useEffect(() => {
    setLoadedCount(0);
    setIsLoaded(false);

    let loaded = 0;
    images.forEach((img) => {
      const image = new Image();
      image.src = img.url;
      if (image.complete) {
        loaded++;
      } else {
        image.onload = () => {
          loaded++;
          if (loaded === images.length) {
            setIsLoaded(true);
          }
        };
      }
    });

    if (loaded === images.length && images.length > 0) {
      setIsLoaded(true);
    }
  }, [images]);

  const previewImages = [
    { _id: "local1", url: "/Images/image.svg" },
    { _id: "local2", url: "/Images/image1.jpg" },
    { _id: "local3", url: "/Images/warzywa.jpg" },
  ];
  //Getting images to gallery
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchImages = () => {
    setIsLoaded(false);
    axios
      .get(`${apiUrl}/gallery`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        } else {
          setImages(previewImages);
        }
      })
      .catch((err) => {
        console.error(err);
        setImages(previewImages);
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const intervalRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
  };

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    startInterval();
  };

  useEffect(() => {
    if (images.length > 0) {
      startInterval();
    }
    return () => clearInterval(intervalRef.current);
  }, [images]);

  return (
    <div className="block justify-center w-[95%] lg:w-[80%] lg:scale-90 mx-auto pt-45">
      <div className="w-full aspect-video overflow-hidden rounded-3xl mx-auto relative">
        {!isLoaded && (
          <div className="bg-[var(--background)] w-full h-full flex justify-center items-center rounded-3xl">
            <div className="loader"></div>
          </div>
        )}
        <div
          className="flex transition-transform duration-500 ease-in-out rounded-3xl"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(100 / images.length) * current}%)`,
            height: `100%`,
            opacity: isLoaded ? 1 : 0,
            position: "relative",
          }}
        >
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src.url}
              alt={`slide ${idx}`}
              onLoad={handleImageLoad}
              className="flex-shrink-0 object-cover rounded-3xl aspect-video"
              style={{ width: `${100 / images.length}%`, height: "100%" }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-5 gap-5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx);
              resetInterval();
            }}
            className={`w-[12px] h-[12px] rounded-full ${
              current === idx
                ? "bg-[var(--alternativeBackground)]"
                : "bg-[var(--background)]"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
