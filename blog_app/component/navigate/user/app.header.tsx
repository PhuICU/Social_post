"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import useSystem, { Language } from "@/app/store/useSystemStore";
import { useShallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";
import React, { useRef, useEffect } from "react";
import Cookies from "js-cookie";
import useUserStore from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";

interface SystemStore {
  lang: string;
  setLanguage: (lang: string) => void;
}
const AppHeader = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const { lang, setLanguage: setLanguageStore } = useSystem<SystemStore>(
    useShallow((state) => ({
      lang: state.lang,
      setLanguage: state.setLanguage,
    }))
  );
  const toggleLanguageMenu = () => {
    setIsLanguageOpen((prev) => !prev);
  };
  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
  };
  const handleLanguageChange = (lang: string) => {
    setLanguageStore(lang);
    setIsLanguageOpen(false);
    i18n.changeLanguage(lang); // Update i18next language
  };

  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
        setIsProfileOpen(false);
      }
    }
    if (isLanguageOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageOpen, isProfileOpen]);

  const onLogout = () => {
    router.push("/sign-in");
    localStorage.removeItem("user");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useUserStore.getState().setUser(null);
  };

  const Language = [
    { code: "vn", name: "Tiếng Việt", flag: "/flags/vi.svg" },
    {
      code: "en",
      name: "English",
      flag: "/flags/en.svg",
    },
    { code: "jp", name: "日本語", flag: "/flags/jp.svg" },
    { code: "cn", name: "中文", flag: "/flags/cn.svg" },
  ];
  return (
    <div>
      <header className="bg-white shadow-md h-15 w-full">
        <nav className="navbar mx-8 my-3">
          <div className="container justify-between flex">
            <div className="menu-icon lg:hidden xl:hidden">
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
            <div className="logo flex">
              <Link href="/" className="flex items-center">
                <div className="px-4">
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </div>
                <div className="py-1.5">
                  <h2 className="font-extrabold">Instagram</h2>
                </div>
              </Link>
            </div>
            <div className="search">
              <div
                className="hidden sm:block
              "
              >
                <input
                  type="text"
                  id="default-input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Tìm kiếm..."
                />
              </div>
            </div>
            <div className="menu py-1.5" ref={dropdownRef}>
              <ul className="flex">
                {" "}
                <li className="md:px-4 px-2">
                  <div className="relative">
                    <button
                      className="flex items-center gap-2"
                      onClick={toggleLanguageMenu}
                      title="Select language"
                      aria-label="Select language"
                    >
                      {(() => {
                        const selectedLang = Language.find(
                          (item) => item.code === lang
                        );
                        return (
                          <Image
                            src={selectedLang?.flag || "/vi.svg"}
                            alt={`${selectedLang?.name || "Unknown"} flag`}
                            width={20}
                            height={20}
                          />
                        );
                      })()}
                    </button>
                  </div>
                  {isLanguageOpen && (
                    <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-2">
                      {Language.map((lang) => (
                        <button
                          key={lang.code}
                          name="language"
                          onClick={() => handleLanguageChange(lang.code)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-md"
                        >
                          <Image
                            src={lang.flag}
                            alt={`${lang.name} flag`}
                            width={20}
                            height={20}
                          />
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
                <li className="md:px-4 px-2">
                  <Image
                    src="bell.svg"
                    alt="Description of the image"
                    width={21}
                    height={21}
                  />
                </li>
                <li className="md:px-4 px-2">
                  <div>
                    <button
                      title="Profile"
                      aria-label="Profile"
                      onClick={toggleProfileMenu}
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
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </button>
                    {isProfileOpen && (
                      <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-2 right-0">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 hover:bg-gray-200 rounded-md"
                        >
                          {t("Trang cá nhân")}
                        </Link>
                        <button
                          onClick={onLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
                        >
                          {t("Đăng xuất")}
                        </button>
                      </div>
                    )}
                  </div>
                </li>
                <li className="md:px-4 px-2 lg:hidden md:hidden xl:hidden">
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
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default AppHeader;
