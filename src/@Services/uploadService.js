// src/@Services/uploadService.js
import api from "../api/axiosInstance";

/**
 * Upload an image to the server
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name ('profiles', 'stores', 'products', 'default')
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadImage = async (file, folder = "default") => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post(
      `/image/upload?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Assuming the backend returns the image URL or path in the response
    // Based on the controller, it returns whatever imageService.uploadImage returns.
    // If it returns the full object or just the path, we might need to adjust.
    // But keeping consistent with previous implementation:
    return response.data.url || response.data; 
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
