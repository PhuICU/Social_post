"use client";
import AppNavigate from "@/component/navigate/auth/app.navigate";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <div className="">{children}</div>
      <div className="sticky top-0 z-50 bg-white shadow-md h-15">
        <AppNavigate />
      </div>
    </div>
  );
}
