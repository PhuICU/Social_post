"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { createPost } from "@/app/api/PostApi";
import {
  uploadCloudinaryMultipleImages,
  uploadCloudinarySingleImage,
} from "@/app/api/ImageApi";
import toast from "bootstrap/js/dist/toast";
import { useShallow } from "zustand/shallow";
import useUserStore, { User } from "@/app/store/useUserStore";

interface CreatePostModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
}

interface ImageData {
  _id: string;
  url: string;
  public_id: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  setIsOpenModal,
}) => {
  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const [post, setPost] = useState({
    content: "",
    images: [] as ImageData[],
    videos: [] as string[],
    posted_by: user?._id,
    scope: "public",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("modal-open");
    };
  }, [setIsOpenModal]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, content: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Check file sizes (max 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const oversizedFiles = fileArray.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        alert(
          `Một số ảnh quá lớn (tối đa 5MB mỗi ảnh). Vui lòng chọn ảnh nhỏ hơn.`
        );
        return;
      }

      setSelectedFiles((prev) => [...prev, ...fileArray]);
    }
  };

  // Process image using API
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

  // Process multiple images using API
  const processMultipleImages = async (files: File[]): Promise<ImageData[]> => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await uploadCloudinaryMultipleImages(formData);
      console.log("Multiple images uploaded successfully:", response);
      // If response.data is an array of urls
      return response.data.map((item) => ({
        _id: item._id,
        url: item.url,
        public_id: item.public_id,
      }));
    } catch (error) {
      console.error("Error processing multiple images:", error);
      throw error;
    }
  };

  const submitCreatePost = async () => {
    try {
      setIsSubmitting(true);
      let imageUrls: ImageData[] = [];

      // Process images using API if any files are selected
      if (selectedFiles.length > 0) {
        try {
          if (selectedFiles.length === 1) {
            // Process single image
            const imageUrl = await processImage(selectedFiles[0]);
            imageUrls.push(imageUrl);
          } else {
            // Process multiple images
            const urls = await processMultipleImages(selectedFiles);
            imageUrls = urls;
          }
        } catch (uploadError: any) {
          console.error("Error uploading images:", uploadError);
          let errorMessage = "Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.";

          if (uploadError.response?.data?.message) {
            errorMessage = uploadError.response.data.message;
          } else if (uploadError.message) {
            errorMessage = uploadError.message;
          }

          alert(errorMessage);
          return;
        }
      }

      // Create post with uploaded image URLs
      const postData = {
        ...post,
        images: imageUrls,
      };
      console.log("Post data to be created:", postData);

      const response = await createPost(postData);
      console.log("response", response);
      setIsOpenModal(false);
      alert("Đăng bài thành công");

      // Reset form
      setPost({
        content: "",
        images: [],
        videos: [],
        posted_by: user?._id,
        scope: "public",
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Có lỗi xảy ra khi đăng bài");
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("Current post state:", post);
  return (
    <div className="fixed inset-0 z-100 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="bg-white  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="border-b-2 flex justify-center border-gray-200 pb-4">
              <h3
                className="text-lg font-medium leading-6  text-gray-900"
                id="modal-title"
              >
                Tạo bài viết mới
              </h3>
            </div>

            <div className="mt-2">
              <div className="my-4">
                <div className="grid grid-cols-12  ">
                  <div className="col-span-1">
                    <Image
                      className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                      src={user?.avatar.url || "/avatar.png"}
                      alt=""
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="col-span-10 items-center">
                    <div className="font-semibold px-1.5 text-[13px] md:text-[13px]">
                      {user?.full_name}
                    </div>
                    <div className="px-1.5">
                      {" "}
                      <div className=" text-[13px] md:text-[15px] relative inline-block rounded-lg bg-gray-200 text-gray-700">
                        <div className="flex items-center">
                          <select
                            name="scope"
                            id="postCategory"
                            onChange={(e) =>
                              setPost({ ...post, scope: e.target.value })
                            }
                            aria-label="Select Category"
                            className="appearance-none border-0  h-[25px]  text-[11px] text-gray-800 rounded-md pl-3 pr-3 py-1 focus:outline-none focus:border-blue-500"
                          >
                            <option value="public">Công khai</option>
                            <option value="friends">Bạn bè</option>
                            <option value="private">Chỉ mình tôi</option>
                          </select>{" "}
                          <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Image
                              src="/caret-down.svg"
                              alt="Arrow Icon"
                              width={12}
                              height={12}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        title="Chọn ảnh để đăng bài"
                        placeholder="Chọn ảnh"
                        aria-label="Chọn ảnh để đăng bài"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 text-gray-600 hover:text-gray-800"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <form>
                  <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className="px-4 py-2 bg-white rounded-b-lg ">
                      {selectedFiles.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-end mb-2">
                            <button
                              type="button"
                              onClick={() => setSelectedFiles([])}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Xóa tất cả
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Selected file ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <textarea
                        id="editor"
                        rows={8}
                        name="content"
                        onChange={handleChange}
                        className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 outline-none focus:ring-0 dark:text-white dark:placeholder-gray-400 h-30 resize-none"
                        placeholder="Bạn muốn đăng gì..."
                        required
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>

              <div></div>
              <div>
                <button
                  type="submit"
                  onClick={submitCreatePost}
                  disabled={isSubmitting}
                  className="inline-flex justify-center px-5 py-2.5 text-sm font-medium text-center w-full text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang đăng bài..." : "Đăng bài"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
