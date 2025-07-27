import instance from "./apiContanst";

type User = {
  id?: number;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  status?: string;
};

export const login = async (user: User) => {
  try {
    const response = await instance.post("/user/login", user);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const register = async (user: User) => {
  try {
    const response = await instance.post("/user/register", user);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await instance.post(`/user/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

export const resendEmailVerification = async (user_id: string) => {
  try {
    const response = await instance.get(`/user/resend-email-verification`, {
      params: { user_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error resending email verification:", error);
    throw error;
  }
};

export const getProfile = async (user_id: string) => {
  try {
    const response = await instance.get(`/user/profile`, {
      params: { user_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getUserById = async (user_id: string) => {
  try {
    const response = await instance.get(`/user/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
