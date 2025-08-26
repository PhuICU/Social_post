"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import useSystem from "@/app/store/useSystemStore";
import { useShallow } from "zustand/shallow";
interface SystemStore {
  lang: string;
  setLanguage: (lang: string) => void;
}

const AppNavigate = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const { lang, setLanguage: setLanguageStore } = useSystem<SystemStore>(
    useShallow((state) => ({
      lang: state.lang,
      setLanguage: state.setLanguage,
    }))
  );

  console.log("Selected Language:", lang);
  const Language = [
    { code: "vn", name: "Tiếng Việt", flag: "/flags/vi.svg" },
    { code: "en", name: "English", flag: "/flags/en.svg" },
    { code: "jp", name: "日本語", flag: "/flags/jp.svg" },
    { code: "cn", name: "中文", flag: "/flags/cn.svg" },
  ];

  const toggleLanguageMenu = () => {
    setIsLanguageOpen((prev) => !prev);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguageStore(lang);
    setIsLanguageOpen(false);
  };
  return (
    <div className="hidden md:block">
      <nav className="navbar  my-3">
        <div className="flex container justify-between bg-white shadow-md h-15 w-full px-8 my-3">
          <div className="menu py-1.5 my-3">
            <ul className="flex gap-4">
              <li className="">
                <Link href="/sign-in" prefetch>
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/sign-up" prefetch>
                  Đăng ký
                </Link>
              </li>
              <li>Trung tâm hỗ trợ</li>
              <li>Dịch vụ</li>
              <li>Chính sách bảo mật</li>
              <li>Về chúng tôi</li>
              <li>Cài đặt</li>
            </ul>
          </div>
          <div className="search py-1.5 my-3">
            <div className="relative">
              <button onClick={toggleLanguageMenu}>
                {Language.find((l) => l.code === lang)?.name || "Language"}
              </button>
              {isLanguageOpen && (
                <ul className="absolute z-10  bg-white shadow-md rounded-md mb-2 bottom-full right-2 pr-5.5">
                  {Language.map((language) => (
                    <li
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={language.flag}
                          alt={language.name}
                          width={20}
                          height={20}
                        />
                        {language.name}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppNavigate;
