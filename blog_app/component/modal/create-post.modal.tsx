import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { createPost } from "@/app/api/PostApi";
import toast from "bootstrap/js/dist/toast";
import { useShallow } from "zustand/shallow";
import useUserStore, { User } from "@/app/store/useUserStore";

const CreatePostModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const [post, setPost] = useState({
    content: "",
    images: [],
    videos: [],
    posted_by: user?._id,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    localStorage.setItem("isOpen", JSON.stringify(isOpen));

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, content: e.target.value });
  };

  const submitCreatePost = async () => {
    const response = await createPost(post)
      .then((res) => {
        console.log("response", res);
        setIsOpen(false);
        alert("Đăng bài thành công");
      })
      .catch((err) => {
        console.error("Error creating post:", err);
      });
    // setIsOpen(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitCreatePost();
    }
  };
  return (
    <div>
      <button
        type="button"
        className="flex items-center"
        data-bs-toggle="modal"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>

        <span className="mx-3.5 my-3 font-bold">Đăng bài</span>
      </button>
      {isOpen && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                          <img
                            className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                            src="data:image/png;base64,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"
                            alt=""
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
                                  name="name"
                                  id="postCategory"
                                  aria-label="Select Category"
                                  className="appearance-none border-0  h-[25px]  text-[11px] text-gray-800 rounded-md pl-3 pr-3 py-1 focus:outline-none focus:border-blue-500"
                                >
                                  <option value="1">Công khai</option>
                                  <option value="2">Bạn bè</option>
                                  <option value="3">Chỉ mình tôi</option>
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
                      </div>
                    </div>
                    <div>
                      <form>
                        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                          {/* <div className="flex items-center justify-between px-3 py-2 border-b  dark:border-gray-600 border-gray-200">
                            <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                              <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 12 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                                    />
                                  </svg>
                                  <span className="sr-only">Attach file</span>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20"
                                  >
                                    <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                  </svg>
                                  <span className="sr-only">Embed map</span>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20"
                                  >
                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                  </svg>
                                  <span className="sr-only">Upload image</span>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20"
                                  >
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z" />
                                  </svg>
                                  <span className="sr-only">Format code</span>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                                  </svg>
                                  <span className="sr-only">Add emoji</span>
                                </button>
                              </div>
                              <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 21 18"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"
                                    />
                                  </svg>
                                  <span className="sr-only">Add list</span>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                                  </svg>
                                  <span className="sr-only">Settings</span>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                                  </svg>
                                  <span className="sr-only">Timeline</span>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                  </svg>
                                  <span className="sr-only">Download</span>
                                </button>
                              </div>
                            </div>
                            <button
                              type="button"
                              data-tooltip-target="tooltip-fullscreen"
                              className="p-2 text-gray-500 rounded-sm cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                            >
                              <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 19 19"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                                />
                              </svg>
                              <span className="sr-only">Full screen</span>
                            </button>
                            <div
                              id="tooltip-fullscreen"
                              role="tooltip"
                              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
                            >
                              Show full screen
                              <div
                                className="tooltip-arrow"
                                data-popper-arrow
                              ></div>
                            </div>
                          </div> */}
                          <div className="px-4 py-2 bg-white rounded-b-lg ">
                            <label htmlFor="editor" className="sr-only">
                              Publish post
                            </label>
                            <textarea
                              id="editor"
                              rows={8}
                              name="content"
                              onChange={handleChange}
                              className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 outline-none focus:ring-0 dark:text-white dark:placeholder-gray-400"
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
                        className="inline-flex justify-center px-5 py-2.5 text-sm font-medium text-center w-full text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                      >
                        Đăng bài
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;
