"use client";
import { useEffect, useState, lazy, Suspense } from "react";

import useUserStore, { User } from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AppHeader = lazy(() => import("@/component/navigate/user/app.header"));
const AppSidebar = lazy(() => import("@/component/navigate/user/app.sidebar"));
const AppContact = lazy(() => import("@/component/navigate/user/app.contact"));
const Loading = lazy(() => import("@/component/Loading"));

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
    const openStatus = localStorage.getItem("isOpen");
    setIsOpen(openStatus === "true");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(Cookies.get("access_token"));
    }
  }, []);

  // Don't render until client-side hydration is complete

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Suspense fallback={<Loading />}>
        <div
          className={`header sticky top-0 w-full bg-white dark:bg-gray-800 shadow-md z-50 h-15 py-2 ${
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
      </Suspense>
    </div>
  );
}
