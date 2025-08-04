"use client";

import { useState } from "react";

const AppContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <div>
      {isOpen === false ? (
        <div className="flex justify-center items-center bg-white rounded-full shadow-md m-2.5 p-1.5">
          <button
            title="Toggle Contact"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="sidebar px-2.5 py-2.5 flex justify-between bg-white rounded-md shadow-md mx-2.5 w-[250px]">
          <div>
            <p className="font-light text-neutral-500 line-clamp-3 ">
              Người liên hệ
            </p>
          </div>
          <div className="mx-4.5 grid grid-cols-2 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
            <button
              title="Toggle Menu"
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
              </svg>
            </button>
            {isOpenMenu && (
              <div className="absolute top-0 right-0 p-2.5 bg-white rounded-md shadow-md mt-33">
                <button
                  className="w-full"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setIsOpenMenu(!isOpenMenu);
                  }}
                >
                  <p>Menu</p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppContact;
