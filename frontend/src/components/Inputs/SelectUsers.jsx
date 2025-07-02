// components/Inputs/SelectUsers.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../layouts/Modal";
import AvatarGroup from "../layouts/AvatarGroup";


const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL);
        if (res.data?.length > 0) setAllUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    getAllUsers();
  }, []);


  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers.filter((u) =>
    selectedUsers.includes(u._id)
  );

  return (
    <div className="space-y-2">
      {/* Avatars of currently assigned users */}
      {selectedUserAvatars.length > 0 && (
         <AvatarGroup avatars={selectedUserAvatars} maxVisible={4} />
      )}

      {/* Button to open modal */}
      <button
        type="button"
        onClick={() => {
          setTempSelectedUsers(selectedUsers);
          setIsModalOpen(true);
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        {selectedUsers.length ? "Edit Assignees" : "Assign Users"}
      </button>

      {/* Modal Component Usage */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select users"
      >
        <ul className="max-h-64 overflow-auto space-y-2 mb-6">
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleUserSelection(user._id)}
              >
                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                />
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                    {user.name?.[0] || "?"}
                  </div>
                )}
                <span>{user.name}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">No users found</li>
          )}
        </ul>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Assign
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;



