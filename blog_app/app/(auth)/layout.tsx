"use client";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const AppNavigate = dynamic(
  () => import("@/component/navigate/auth/app.navigate"),
  {
    ssr: false,
  }
);
import useUserStore, { User } from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Loading = dynamic(() => import("@/component/Loading"));

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
