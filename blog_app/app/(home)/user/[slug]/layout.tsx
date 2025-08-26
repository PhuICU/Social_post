"use client";
import React, { Suspense, useState, lazy } from "react";

const Loading = lazy(() => import("@/component/Loading"));
const AppProfile = lazy(() => import("@/component/navigate/user/app.profile"));

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Suspense fallback={<Loading />}>
        <div className="container mx-auto mb-7 px-1 grid grid-cols-10">
          <div className="col-span-8">
            <div>
              <AppProfile />
            </div>
            <div>{children}</div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </Suspense>
    </div>
  );
}
