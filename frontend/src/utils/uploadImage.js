import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(API_PATHS.UPLOAD.IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Upload response:", response); // response is data directly

    if (!response?.url) {
      throw new Error("Image URL not found in response");
    }

    return response.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error.message || "Image upload failed.";
  }
};

export default uploadImage;


