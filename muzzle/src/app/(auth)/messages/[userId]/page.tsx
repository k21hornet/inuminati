import Link from "next/link";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { DirectMessage, User } from "@/lib/api/types";
import { MessageThread } from "@/features/dm/message-thread";

type Props = { params: Promise<{ userId: string }> };

export default async function MessageThreadPage({ params }: Props) {
  const { userId: partnerUserId } = await params;
  const { token } = await auth0.getAccessToken();

  const [me, partner, messages] = await Promise.all([
    apiFetch.get<User>("/api/v1/users/me", token).catch(() => null),
    apiFetch.get<User>(`/api/v1/users/${partnerUserId}`, token).catch(() => null),
    apiFetch.get<DirectMessage[]>(`/api/v1/messages/${partnerUserId}`, token).catch(() => []),
  ]);

  return (
    <div className="flex flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3">
        <Link href="/messages" className="text-sm text-gray-500">
          ←
        </Link>
        <h1 className="font-semibold">{partner?.username ?? partnerUserId}</h1>
      </header>

      <MessageThread
        partnerUserId={partnerUserId}
        myUserId={me?.id ?? ""}
        initialMessages={messages}
      />
    </div>
  );
}
