"use client";
import { useEffect, useState } from "react";
import AppHeader from "@/component/navigate/user/app.header";
import AppSidebar from "@/component/navigate/user/app.sidebar";
import AppContact from "@/component/navigate/user/app.contact";
import useUserStore, { User } from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    const openStatus = localStorage.getItem("open");
    setIsOpen(openStatus === "true");
  }, []);
  useEffect(() => {
    setAccessToken(Cookies.get("access_token"));
  }, []);

  useEffect(() => {
    if (user === null && !accessToken) {
      router.push("/sign-in");
    }
  }, [user, accessToken, router]);
  if (accessToken === undefined) {
    // Still hydrating, render nothing or a loading spinner
    console.log("Access token is undefined, waiting for hydration...");
    return null;
  }
  return (
    <div className="bg-gray-100">
      <div
        className={`header sticky top-0 w-full bg-white shadow-md z-50 h-15 py-2 ${
          isOpen ? "hidden" : ""
        }`}
      >
        <AppHeader />
      </div>
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-50 overflow-hidden px-3.5 py-15">
        <AppSidebar />
      </div>
      <div className="grid grid-cols-12 my-10">
        <div className="lg:col-span-2 sm:col-span-1"></div>
        <div className="col-span-8">{children}</div>
        <div
          className={`contact justify-items-end max-[1150px]:hidden sticky top-0 right-0 h-screen lg:fixed overflow-hidden pt-25 sidebar  z-40 ${
            isOpen ? "hidden" : ""
          }`}
        >
          <AppContact />
        </div>
      </div>
    </div>
  );
}
