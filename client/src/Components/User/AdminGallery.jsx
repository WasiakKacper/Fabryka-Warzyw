import React, { useState, useEffect, useContext } from "react";
import ShopContext from "../../Context/ShopContext.jsx";
import axios from "axios";

const AdminGallery = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { setIsLoaded } = useContext(ShopContext);

  //Adding image to gallery
  const [images, setImages] = useState([]);

  const previewImages = [
    { _id: "local1", url: "/Images/image.svg" },
    { _id: "local2", url: "/Images/image1.jpg" },
    { _id: "local3", url: "/Images/warzywa.jpg" },
  ];

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Wybierz zdjęcie do przesłania");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setIsLoaded(true);
      const res = await axios.post(`${apiUrl}/gallery`, formData);
      const newImage = res.data;

      setImages((prevImages) => [...prevImages, newImage]);

      setImage(null);
      setPreview(null);
      setIsLoaded(false);
      alert("Zdjęcie zostało dodane do galerii!");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania zdjęcia");
    }
  };

  //Getting images from db
  const fetchImages = () => {
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

  //Replacing images
  const handleReplaceImage = async (id) => {
    if (!image) {
      alert("Najpierw wybierz nowe zdjęcie do podmiany");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.put(`${apiUrl}/gallery/${id}`, formData);
      setImages((prevImages) =>
        prevImages.map((img) =>
          img._id === id ? { ...img, url: res.data.image.url } : img
        )
      );
      alert("Zdjęcie zaktualizowane");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas aktualizacji zdjęcia");
    }
  };

  //Deleting image
  const handleDeleteImage = async (id) => {
    const confirmed = window.confirm(
      "Czy napewno chcesz usunąć zdjęcie z galerii?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${apiUrl}/gallery/${id}`);
      setImages((prevImages) => prevImages.filter((img) => img._id !== id));
      alert("Zdjęcie usunięte");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas usuwania zdjęcia");
    }
  };

  return (
    <section className="flex flex-col items-center">
      <h2 className="text-[5vw] md:text-[4vw] lg:text-[3vw] mb-5">
        Galeria zdjęć
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={img._id} className="relative">
            <img
              src={img.url}
              alt={`Zdjęcie ${index}`}
              className="rounded-2xl w-[100%] h-[300px]"
            />
            <button
              className="absolute top-1 right-1 bg-(--alternativeAccent) hover:bg-(--hoverAlternativeAccent) cursor-pointer transition text-white px-2 py-1 rounded"
              onClick={() => handleDeleteImage(img._id)}
            >
              Usuń
            </button>
            <button
              className="absolute bottom-1 right-1 bg-(--accent) hover:bg-(--hoverAccent) cursor-pointer transition text-white px-2 py-1 rounded"
              onClick={() => handleReplaceImage(img._id)}
            >
              Zastąp
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <input
          type="file"
          onChange={handleFileChange}
          className="w-[30%] mt-3 mr-5 text-white px-4 py-2 rounded bg-(--accent) hover:bg-(--hoverAccent) cursor-pointer transition"
        />
        {preview && (
          <img src={preview} alt="Podgląd" className="mt-3 w-40 h-auto" />
        )}
        <button
          onClick={handleUpload}
          className="mt-3 text-white px-4 py-2 rounded bg-(--accent) hover:bg-(--hoverAccent) cursor-pointer transition"
        >
          Dodaj do galerii
        </button>
      </div>
    </section>
  );
};

export default AdminGallery;
