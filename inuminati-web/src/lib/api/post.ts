import { fetcher } from "@/util/fetcher";

export const getPosts = async (userName?: string) => {
  const query = userName ? `?userName=${userName}` : "";
  return fetcher.get(`/posts${query}`);
};

export const getPost = async (postId: string) => {
  return fetcher.get(`/posts/${postId}`);
};
