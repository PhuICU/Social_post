"use client";

import React, { useEffect, useState } from "react";
import useQuery from "@/app/hook/useQueryParam";
import { useRouter } from "next/navigation";
import { resendEmailVerification, verifyEmail } from "@/app/api/AuthApi";

interface UserData {
  insertedId: string;
  [key: string]: any;
}

export default function Verify() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const router = useRouter();

  const resend = async () => {
    if (!user?.insertedId) {
      console.error("No user data found");
      return;
    }

    try {
      const response = await resendEmailVerification(user.insertedId);
      console.log(response);
      localStorage.removeItem("user");
      router.push("/sign-in");
    } catch (error) {
      console.error("Error resending email verification:", error);
      throw error;
    }
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Verify Page</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Verify Page</h1>
      <p className="text-gray-600">This is the verify page.</p>
      <button onClick={resend}>xac thuc</button>
    </div>
  );
}
