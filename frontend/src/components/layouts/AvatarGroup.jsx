import React from 'react';

const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
  const validAvatars = avatars.filter((user) => typeof user?.profileImageUrl === "string" && user.profileImageUrl.trim() !== "");
  const visibleAvatars = validAvatars.slice(0, maxVisible);
  const extraCount = validAvatars.length - maxVisible;

  return (
    <div className="flex -space-x-3 items-center">
      {visibleAvatars.map((user, index) => (
        <img
          key={user._id || index}
          src={user.profileImageUrl || "/default-avatar.png"}
          alt={`Avatar ${index + 1}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
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


