import { useState, useRef } from 'react';
import axios from 'axios';
import APIEndPoints from '../middleware/ApiEndPoints';

export default function VideoUpload({ onVideoUpload, currentVideo }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const VideoUploadAPIEndpoint = APIEndPoints.video_upload.url;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024 * 1024) {
        setFileUploadError('Video must be less than 1GB');
        return;
      }
      setFile(selectedFile);
      setFileUploadError(false);
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post(VideoUploadAPIEndpoint, formData, {
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
        onVideoUpload(response.data.videoUrl);
        setFile(null);
      }
    } catch (error) {
      setFileUploadError(
        error.response?.data?.message || 'Video upload failed'
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
        accept="video/mp4"
      />
      <video
        onClick={() => fileRef.current.click()}
        src={file ? URL.createObjectURL(file) : currentVideo}
        controls
        className="max-w-xs max-h-40 border rounded-lg cursor-pointer self-center mt-2"
        poster={file || currentVideo ? undefined : 'https://via.placeholder.com/150?text=Upload+Video'}
      />
      <p className="text-sm self-center mt-2">
        {fileUploadError ? (
          <span className="text-error">{fileUploadError}</span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
        ) : filePerc === 100 ? (
          <span className="text-green-700">Video successfully uploaded!</span>
        ) : (
          ''
        )}
      </p>
    </div>
  );
}