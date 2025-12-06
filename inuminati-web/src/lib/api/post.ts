import { fetcher } from "@/util/fetcher";

export const getPosts = async (userId?: number) => {
  const query = userId ? `?userId=${userId}` : "";
  return fetcher.get(`/posts${query}`);
};

export const getPost = async (postId: number) => {
  return fetcher.get(`/posts/${postId}`);
};
