import instance, { uploadInstance } from "./apiContanst";

interface UploadImageResponse {
  message: string;
  data: {
    url: string;
    public_id: string;
    _id: string;
  };
}

export const uploadCloudinarySingleImage = async (
  data: FormData
): Promise<UploadImageResponse> => {
  try {
    const response = await uploadInstance.post<UploadImageResponse>(
      "/image/single-image",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

interface UploadMultipleImagesResponse {
  message: string;
  data: {
    url: string;
    public_id: string;
    _id: string;
  }[];
}

export const uploadCloudinaryMultipleImages = async (
  data: FormData
): Promise<UploadMultipleImagesResponse> => {
  try {
    const response = await uploadInstance.post<UploadMultipleImagesResponse>(
      "/image/multiple-images",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
};

export const destroyImages = async (
  url: string[]
): Promise<{ message: string; data: { url: string[] } }> => {
  try {
    const response = await instance.put<{
      message: string;
      data: { url: string[] };
    }>("/image/destroy", { url });
    return response.data;
  } catch (error) {
    console.error("Error destroying images:", error);
    throw error;
  }
};

export const getCloudinaryImageById = async (
  id: string
): Promise<{
  message: string;
  data: { url: string; public_id: string; _id: string; poster_id: string };
}> => {
  try {
    const response = await instance.get<{
      message: string;
      data: { url: string; public_id: string; _id: string; poster_id: string };
    }>(`/image/images/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    throw error;
  }
};

export const getImageByIdUser = async (user_id: string) => {
  try {
    const response = await instance.get(`/image/user/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user image by ID:", error);
    throw error;
  }
};
