import { useRef, useState } from 'react';
import axios from 'axios';
import APIEndPoints from '../middleware/ApiEndPoints';

export default function PdfUpload({ onPdfUpload, currentPdf }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadError('');
      uploadPdf(selectedFile);
    } else {
      setUploadError('Only PDF files are allowed.');
    }
  };

  const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post(APIEndPoints.upload_assignment_pdf.url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
        withCredentials: true,
      });

      if (res.data.success) {
        onPdfUpload(res.data.pdfUrl);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      setUploadError(error.response?.data?.message || 'PDF upload failed');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium text-sm">Upload Assignment PDF</label>
      <input
        type="file"
        ref={fileRef}
        hidden
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="px-4 py-2 bg-tertiary rounded-lg text-sm hover:bg-secondary/20 transition-colors"
      >
        {file ? 'Change PDF' : 'Select PDF'}
      </button>
      {file && <p className="text-sm text-gray-600">{file.name}</p>}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <p className="text-xs text-gray-500">Uploading {uploadProgress}%</p>
      )}
      {uploadProgress === 100 && <p className="text-green-600 text-sm">Upload complete!</p>}
      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
      {currentPdf && (
        <a
          href={currentPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm underline mt-1"
        >
          View Uploaded PDF
        </a>
      )}
    </div>
  );
}
