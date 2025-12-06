import { fetcher } from "@/util/fetcher";

export const getProfile = async (userId: number) => {
  return fetcher.get(`/users/${userId}`);
};
