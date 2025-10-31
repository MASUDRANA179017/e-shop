import axios from "axios";

/**
 * Upload an image to the server
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name ('profiles', 'stores', etc.)
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadImage = async (file, folder = "general") => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `http://localhost:8000/image/upload?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
