import { fetcher } from "@/util/fetcher";

type PostData = {
  userId: number;
  content: string | null;
  images: {
    imageUrl: string;
    imageOrder: number;
  }[];
};

export const getPosts = async (userId?: number) => {
  const query = userId ? `?userId=${userId}` : "";
  return fetcher.get(`/posts${query}`);
};

export const getPost = async (postId: number) => {
  return fetcher.get(`/posts/${postId}`);
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "画像のアップロードに失敗しました");
  }

  const data = await response.json();
  return data.imageUrl;
};

export const createPost = async (postData: PostData) => {
  return fetcher.post("/posts", postData);
};
