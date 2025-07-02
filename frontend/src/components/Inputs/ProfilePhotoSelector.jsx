import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setImage(file); // Store the actual file object
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = ''; // Clear the file input
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      <div className="relative w-24 h-24 rounded-full bg-gray-100 mb-3 overflow-hidden flex items-center justify-center border border-gray-300">
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <LuTrash size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <LuUser size={32} />
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        className="hidden"
      />

      {!previewUrl ? (
        <button
          type="button"
          onClick={onChooseFile}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          <LuUpload size={16} />
          <span>Upload Photo</span>
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onChooseFile}
            className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Change
          </button>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
