// components/ImageUpload.jsx
import { useState, useRef } from 'react';
import axios from 'axios';
import APIEndPoints from '../middleware/ApiEndPoints';

export default function ImageUpload({ onImageUpload, currentImage }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const ImageUploadAPIEndpoints = APIEndPoints.image_upload.url;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024 * 1024) {
        setFileUploadError('Image must be less than 1GB');
        return;
      }
      setFile(selectedFile);
      setFileUploadError(false);
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(ImageUploadAPIEndpoints, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFilePerc(percentCompleted);
        },
        withCredentials: true,
      });

      if (response.data.success) {
        onImageUpload(response.data.imageUrl);
      }
    } catch (error) {
      setFileUploadError(
        error.response?.data?.message || 'Image upload failed'
      );
      setFilePerc(0);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        onChange={handleFileChange}
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
      />
      <img
        onClick={() => fileRef.current.click()}
        src={file ? URL.createObjectURL(file) : currentImage}
        alt="profile"
        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
      />
      <p className="text-sm self-center mt-2">
        {fileUploadError ? (
          <span className="text-error">{fileUploadError}</span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
        ) : filePerc === 100 ? (
          <span className="text-green-700">Image successfully uploaded!</span>
        ) : (
          ''
        )}
      </p>
    </div>
  );
}