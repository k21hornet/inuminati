"use server";

import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";

export async function likePost(postId: string): Promise<void> {
  const { token } = await auth0.getAccessToken();
  await apiFetch.post(`/api/v1/posts/${postId}/likes`, token);
  revalidatePath(`/posts/${postId}`);
}

export async function unlikePost(postId: string): Promise<void> {
  const { token } = await auth0.getAccessToken();
  await apiFetch.delete(`/api/v1/posts/${postId}/likes`, token);
  revalidatePath(`/posts/${postId}`);
}
