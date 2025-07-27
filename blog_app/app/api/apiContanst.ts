import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => {
    console.error("Request error:", err);
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (response) => {
    // if (response.config.url === "login") {
    //   console.log("Login response:", response.data);
    //   const accessToken = "Bearer " + response.data.data.access_token;
    //   const refreshToken = response.data.data.refresh_token;
    //   Cookies.set("access_token", accessToken, { expires: 1 });
    //   Cookies.set("refresh_token", refreshToken, { expires: 7 });
    // }

    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    console.log("error", error.response);
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = Cookies.get("refresh_token");
      if (!refresh_token) {
        return Promise.reject(error);
      }
      try {
        const response = await instance.post("/user/refresh-access-token", {
          refresh_token,
        });
        console.log("response", response.data);
        if (response.status === 200) {
          const newAccessToken = response.data.data.access_token;
          const newRefreshToken = response.data.data.refresh_token;

          // Update the local storage with new tokens
          Cookies.set("access_token", newAccessToken, { expires: 1 });
          Cookies.set("refresh_token", newRefreshToken, { expires: 7 });

          // Update the authorization header in the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return instance(originalRequest);
        }
      } catch (error) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
