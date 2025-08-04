"use client";
import { lazy, Suspense, useEffect, useState } from "react";
const AppNavigate = lazy(
  () => import("@/component/navigate/auth/app.navigate")
);
import useUserStore, { User } from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Loading = lazy(() => import("@/component/Loading"));

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = Cookies.get("access_token");
      setAccessToken(accessToken);
    }
  }, []);

  return (
    <div className="">
      <Suspense fallback={<Loading />}>
        <div className="">{children}</div>
        <div className="sticky top-0 z-50 bg-white shadow-md h-15">
          <AppNavigate />
        </div>{" "}
      </Suspense>
    </div>
  );
}
