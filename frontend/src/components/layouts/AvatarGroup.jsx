import React from 'react';

const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = avatars.length - maxVisible;

  return (
    <div className="flex -space-x-3 items-center">
      {visibleAvatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          className="w-8 h-8 rounded-full border-2 border-white object-cover"
        />
      ))}

      {extraCount > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 text-sm flex items-center justify-center font-medium text-gray-700">
          +{extraCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;

