"use client";

import React, { useEffect } from "react";
import useQuery from "@/app/hook/useQueryParam";
import { useRouter } from "next/navigation";
import { resendEmailVerification, verifyEmail } from "@/app/api/AuthApi";

export default function Verify() {
  const user = localStorage.getItem("user");
  const data = user ? JSON.parse(user) : null;

  console.log("user", data.insertedId);

  const router = useRouter();

  const resend = async () => {
    try {
      const response = await resendEmailVerification(data.insertedId);
      console.log(response);
      localStorage.removeItem("user");
      router.push("/sign-in");
    } catch (error) {
      console.error("Error resending email verification:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Verify Page</h1>
      <p className="text-gray-600">This is the verify page.</p>
      <button onClick={resend}>xac thuc</button>
    </div>
  );
}
