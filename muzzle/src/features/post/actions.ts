"use server";

import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch, postFormData } from "@/lib/api/fetcher";
import type { Post } from "@/lib/api/types";

export async function createPost(formData: FormData): Promise<void> {
  const { token } = await auth0.getAccessToken();
  const post = await postFormData<Post>("/api/v1/posts", token, formData);
  redirect(`/posts/${post.id}`);
}

export async function deletePost(postId: string): Promise<void> {
  const { token } = await auth0.getAccessToken();
  await apiFetch.delete(`/api/v1/posts/${postId}`, token);
}
