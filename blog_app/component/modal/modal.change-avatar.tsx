import React, { useState, useRef, useEffect, use } from "react";
import Image from "next/image";

import { uploadCloudinarySingleImage, destroyImages } from "@/app/api/ImageApi";
import { updateProfile } from "@/app/api/AuthApi";
import useUserStore from "@/app/store/useUserStore";

interface CreatePostModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
}
interface ImageData {
  _id: string;
  url: string;
  public_id: string;
}

const ModalChangeAvatar: React.FC<CreatePostModalProps> = ({
  setIsOpenModal,
}) => {
  const user = useUserStore((state) => state.user);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Function to crop image to balanced square
  const cropImageToSquare = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas context not found");
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        const size = 300;
        canvas.width = size;
        canvas.height = size;

        // Tính crop chính giữa
        const aspect = img.width / img.height;
        let sx = 0,
          sy = 0,
          sw = img.width,
          sh = img.height;

        if (aspect > 1) {
          sw = sh;
          sx = (img.width - sw) / 2;
        } else if (aspect < 1) {
          sh = sw;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFile = new File([blob], file.name, {
                type: "image/jpeg",
              });
              resolve(croppedFile);
            } else {
              reject("Failed to crop image.");
            }
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = reject;

      img.src = URL.createObjectURL(file);
    });
  };

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const croppedFile = await cropImageToSquare(file);
      setSelectedFiles([croppedFile]);

      const previewUrl = URL.createObjectURL(croppedFile);
      setCroppedImage(previewUrl);
    } catch (err) {
      console.error("Lỗi crop ảnh:", err);
      setSelectedFiles([file]);
      setCroppedImage(URL.createObjectURL(file));
    }
  };

  const processImage = async (file: File): Promise<ImageData> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await uploadCloudinarySingleImage(formData);
      console.log("Image uploaded successfully:", response);
      return {
        _id: response.data._id,
        url: response.data.url,
        public_id: response.data.public_id,
      };
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  };

  const handleUpdateAvatar = async () => {
    if (selectedFiles.length === 0) return;
    const file = selectedFiles[0];

    try {
      setIsSubmitting(true);
      const imageUrl = await processImage(file);
      console.log("Image URL:", imageUrl);

      const currentUser = useUserStore.getState().user;
      console.log("Current user:", currentUser);
      if (currentUser) {
        useUserStore.getState().setUser({
          ...currentUser,
          avatar: { url: imageUrl.url, public_id: imageUrl.public_id },
          _id: currentUser._id,
          full_name: currentUser.full_name ?? "",
          address: currentUser.address ?? "",
          email: currentUser.email ?? "",
          phone: currentUser.phone ?? "",
          bio: currentUser.bio ?? "",
        });
      }
      const response = await updateProfile({
        full_name: currentUser?.full_name ?? "",
        email: currentUser?.email ?? "",
        bio: currentUser?.bio ?? "",
        phone: currentUser?.phone ?? "",
        address: currentUser?.address ?? "",
        avatar: { url: imageUrl.url, public_id: imageUrl.public_id },
      });
      console.log("Profile updated successfully:", response);

      setIsOpenModal(false);
      setCroppedImage(null);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload thất bại:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.avatar?.url) return;

    try {
      await destroyImages([user.avatar.url]);

      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        useUserStore.getState().setUser({
          ...currentUser,
          avatar: { url: "", public_id: "" },
          _id: currentUser._id,
          full_name: currentUser.full_name ?? "",
          address: currentUser.address ?? "",
          email: currentUser.email ?? "",
          phone: currentUser.phone ?? "",
          bio: currentUser.bio ?? "",
        });
      }
      const response = await updateProfile({
        full_name: currentUser?.full_name ?? "",
        email: currentUser?.email ?? "",
        bio: currentUser?.bio ?? "",
        phone: currentUser?.phone ?? "",
        address: currentUser?.address ?? "",
        avatar: { url: "", public_id: "" },
      });
      console.log("Profile updated successfully:", response);

      setIsOpenModal(false);
      setCroppedImage(null);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(false);
        // Reset form data when closing without saving
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);
  console.log("isShowingImage:", isShowingImage);
  return (
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={modalRef}
          className="relative transform overflow-hidden mt-9 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="bg-white p-6 flex justify-center flex-col items-center ">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Thay đổi ảnh đại diện
            </h3>
            {selectedFiles.length === 0 && (
              <div className="flex flex-col items-center gap-3">
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleChangeAvatar}
                      className="hidden"
                      title="Chọn ảnh để đăng bài"
                      placeholder="Chọn ảnh"
                      aria-label="Chọn ảnh để đăng bài"
                    />
                    <span className="text-blue-500">Thêm ảnh đại diện</span>
                  </label>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setIsShowingImage(true);
                    }}
                    className="text-blue-500"
                  >
                    Xem ảnh đại diện
                  </button>
                </div>
                <div>
                  <button
                    className="text-red-500"
                    onClick={handleRemoveAvatar}
                    disabled={!user?.avatar?.url}
                  >
                    Gỡ ảnh đại diện
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setIsOpenModal(false);
                      setCroppedImage(null);
                      setSelectedFiles([]);
                    }}
                    type="button"
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            )}
            {selectedFiles.length > 0 && (
              <div>
                <div className="space-y-4">
                  {croppedImage && (
                    <div className="overflow-hidden">
                      <Image
                        src={croppedImage}
                        alt="Cropped Avatar"
                        width={300}
                        height={300}
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}

                  <canvas
                    ref={canvasRef}
                    className="hidden"
                    width="300"
                    height="300"
                  />
                </div>
                <div className="flex items-center justify-center gap-4">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => {
                          handleUpdateAvatar();
                        }}
                        type="button"
                        className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => {
                          setIsOpenModal(false);
                          setCroppedImage(null);
                          setSelectedFiles([]);
                        }}
                        type="button"
                        className="inline-flex justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 mr-2"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isShowingImage && user?.avatar?.url && (
        <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-20">
          <div className="bg-white p-4 ">
            <Image
              src={user?.avatar?.url}
              alt="Cropped Avatar"
              width={450}
              height={450}
              className=" object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalChangeAvatar;
