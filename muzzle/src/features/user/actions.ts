"use server";

import { auth0 } from "@/lib/auth/auth0";
import { putFormData } from "@/lib/api/fetcher";
import type { User } from "@/lib/api/types";

export async function updateProfile(
  userId: string,
  formData: FormData
): Promise<User> {
  const { token } = await auth0.getAccessToken();
  return putFormData<User>(`/api/v1/users/${userId}`, token, formData);
}
