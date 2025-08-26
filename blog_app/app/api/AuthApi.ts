import instance from "./apiContanst";

export type User = {
  id?: number;
  email: string;

  full_name?: string;
  phone?: string;
  address?: string;
  avatar?: { url: string; public_id: string } | null;
  bio?: string;
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

export const updateProfile = async (user: User) => {
  try {
    const response = await instance.put(`/user/profile`, user);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
export const changePassword = async (
  user_id: string,
  new_password: string,
  old_password: string
) => {
  try {
    const response = await instance.post(`/user/change-password`, {
      user_id,
      new_password,
      old_password,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
export const forgotPassword = async (email: string) => {
  try {
    const response = await instance.post(`/user/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error in forgot password:", error);
    throw error;
  }
};

export const resetPassword = async (data: {
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await instance.post(`/user/reset-password`, data);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const lockAccount = async (user_id: string) => {
  try {
    const response = await instance.put(`/user/lock-account/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error locking account:", error);
    throw error;
  }
};

export const unlockAccount = async (user_id: string) => {
  try {
    const response = await instance.put(`/user/unlock-account/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error unlocking account:", error);
    throw error;
  }
};

export const getUserBySlug = async (slug: string) => {
  try {
    const response = await instance.get(`/user/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by slug:", error);
    throw error;
  }
};
