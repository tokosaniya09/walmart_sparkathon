'use client';

import { useRef, useState } from "react";
import Webcam from "react-webcam";

type CameraModalProps = {
  open: boolean;
  onClose: () => void;
  onImageSelect: (file: File | string) => void; // string if base64 from webcam, File if from input
};

export default function CameraModal({ open, onClose, onImageSelect }: CameraModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Handle file upload
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
      onClose();
    }
  };

  // Handle webcam photo
  const handleTakePhotoClick = () => {
    setShowWebcam(true);
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // onImageSelect(imageSrc); // This will be a base64 string
        const blob = base64ToBlob(imageSrc);
    const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
    onImageSelect(file); // Now handled like an uploaded file!
        setShowWebcam(false);
        onClose();
      }
    }
  };

  const handleCloseWebcam = () => {
    setShowWebcam(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-9 py-7 shadow-lg max-w-xs w-full">
        <h2 className="text-lg font-bold mb-4 text-center">Image Search</h2>
        {!showWebcam ? (
          <div className="flex flex-col gap-3">
            <button
              className="px-4 py-2 bg-blue-800 text-white rounded"
              onClick={handleUpload}
            >
              Upload from Device
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              className="px-4 py-2 bg-blue-800 text-white rounded"
              onClick={handleTakePhotoClick}
            >
              Take a Photo
            </button>
            <button className="py-1 bg-gray-100 text-red-500" onClick={onClose}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded mb-2"
              width={480}
              height={360}
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-blue-800 text-white rounded"
                onClick={handleCapture}
              >
                Capture
              </button>
              <button
                className="px-4 py-2 bg-gray-100 text-red-500 rounded"
                onClick={handleCloseWebcam}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function base64ToBlob(base64: string, mime: string = 'image/jpeg'): Blob {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}