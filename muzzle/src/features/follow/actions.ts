"use server";

import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";

export async function followUser(targetUserId: string): Promise<void> {
  const { token } = await auth0.getAccessToken();
  await apiFetch.post(`/api/v1/users/${targetUserId}/follows`, token);
  revalidatePath(`/users/${targetUserId}`);
}

export async function unfollowUser(targetUserId: string): Promise<void> {
  const { token } = await auth0.getAccessToken();
  await apiFetch.delete(`/api/v1/users/${targetUserId}/follows`, token);
  revalidatePath(`/users/${targetUserId}`);
}
