"use server";

import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { DirectMessage } from "@/lib/api/types";

export async function sendMessage(
  partnerUserId: string,
  content: string
): Promise<DirectMessage> {
  const { token } = await auth0.getAccessToken();
  const msg = await apiFetch.post<DirectMessage>(
    `/api/v1/messages/${partnerUserId}`,
    token,
    { content }
  );
  revalidatePath(`/messages/${partnerUserId}`);
  revalidatePath("/messages");
  return msg;
}
