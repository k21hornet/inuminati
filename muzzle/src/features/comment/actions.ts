"use server";

import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { Comment } from "@/lib/api/types";

export async function createComment(postId: string, content: string): Promise<Comment> {
  const { token } = await auth0.getAccessToken();
  const comment = await apiFetch.post<Comment>(
    `/api/v1/posts/${postId}/comments`,
    token,
    { content }
  );
  revalidatePath(`/posts/${postId}`);
  return comment;
}

export async function deleteComment(commentId: string, postId: string): Promise<void> {
  const { token } = await auth0.getAccessToken();
  await apiFetch.delete(`/api/v1/comments/${commentId}`, token);
  revalidatePath(`/posts/${postId}`);
}
