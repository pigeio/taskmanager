import React from 'react';

const DeleteAlert = ({ content, onDelete, onCancel = () => {} }) => {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm">
      <p className="text-sm text-red-800 font-medium">{content}</p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs md:text-sm font-medium text-gray-600 border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="text-xs md:text-sm font-medium text-white bg-red-600 rounded-lg px-4 py-1.5 hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;

