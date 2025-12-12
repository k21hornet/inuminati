import { fetcher } from "@/util/fetcher";

export const getProfile = async (userId: string) => {
  return fetcher.get(`/users/${userId}`);
};

export const signupUser = async (email: string, accessToken: string) => {
  return fetcher.post("/auth/signup", { email }, accessToken);
};

export const getUserName = async () => {
  return fetcher.get("/auth/me");
};
