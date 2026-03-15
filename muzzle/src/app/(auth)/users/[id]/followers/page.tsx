import Link from "next/link";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { User, UserIdList } from "@/lib/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = { params: Promise<{ id: string }> };

export default async function FollowersPage({ params }: Props) {
  const { id } = await params;
  const { token } = await auth0.getAccessToken();

  const { userIds } = await apiFetch
    .get<UserIdList>(`/api/v1/users/${id}/followers`, token)
    .catch(() => ({ userIds: [] }));

  const users = await Promise.all(
    userIds.map((uid) =>
      apiFetch.get<User>(`/api/v1/users/${uid}`, token).catch(() => null)
    )
  );

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white px-4 py-3">
        <Link href={`/users/${id}`} className="text-sm text-gray-500">
          ←
        </Link>
        <h1 className="font-semibold">フォロワー</h1>
      </header>

      <ul className="divide-y">
        {users.filter(Boolean).map((user) => (
          <li key={user!.id}>
            <Link
              href={`/users/${user!.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user!.avatarUrl} alt={user!.username} />
                <AvatarFallback>{user!.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{user!.username}</span>
            </Link>
          </li>
        ))}
        {userIds.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-gray-400">
            フォロワーはいません
          </li>
        )}
      </ul>
    </div>
  );
}
