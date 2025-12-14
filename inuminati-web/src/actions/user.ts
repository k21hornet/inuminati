"use server";

import { fetcher } from "@/util/fetcher";

export const followUser = async (targetUserName: string) => {
  return fetcher.post(`/users/${targetUserName}/follow`);
};
