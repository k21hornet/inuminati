import Link from "next/link";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { ConversationSummary } from "@/lib/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function MessagesPage() {
  const { token } = await auth0.getAccessToken();

  const conversations = await apiFetch
    .get<ConversationSummary[]>("/api/v1/messages", token)
    .catch(() => []);

  return (
    <div>
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <h1 className="font-semibold">メッセージ</h1>
      </header>

      {conversations.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-gray-400">
          メッセージはまだありません
        </p>
      ) : (
        <ul className="divide-y">
          {conversations.map((conv) => (
            <li key={conv.partnerId} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
              {/* アバター → プロフィールへ */}
              <Link href={`/users/${conv.partnerId}`} className="shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conv.partnerAvatarUrl} alt={conv.partnerUsername} />
                  <AvatarFallback>
                    {conv.partnerUsername.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              {/* テキスト → スレッドへ */}
              <Link href={`/messages/${conv.partnerId}`} className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{conv.partnerUsername}</p>
                <p className="truncate text-sm text-gray-500">{conv.lastContent}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
