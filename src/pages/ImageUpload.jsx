import { useState } from "react";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file); // Store the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageBase64 = reader.result;
      setImageData(imageBase64);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedFile || !imageData) {
      console.error("No file selected or image data available");
      return;
    }

    const image = imageData.split(",")[1];
    const type = selectedFile.type;
    const name = selectedFile.name;

    try {
      const response = await fetch("http://localhost:5500/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: {
            name: name,
            type: type,
            data: image,
          },
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const retrieveImage = async (id) => {
    const response = await fetch(`http://localhost:5500/api/images/${id}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      document.body.appendChild(img);
    } else {
      console.error("Error retrieving image");
    }
  };
  const handleRetrieve = () => {
    const id = prompt("Enter image ID:");
    retrieveImage(id);
  };
  return (
    <div style={{ padding: "200px" }}>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={uploadImage}>Upload</button>
      <button onClick={handleRetrieve}>Retrieve</button>
    </div>
  );
};

export default ImageUpload;