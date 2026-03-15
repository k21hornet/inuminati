import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { Post, User } from "@/lib/api/types";
import { PostCard } from "@/features/post/post-card";

export default async function FeedPage() {
  const { token } = await auth0.getAccessToken();

  const posts = await apiFetch
    .get<Post[]>("/api/v1/posts?limit=30", token)
    .catch(() => [] as Post[]);

  // 投稿に紐づくユーザーを並列取得
  const authors = await Promise.all(
    [...new Set(posts.map((p) => p.userId))].map((uid) =>
      apiFetch.get<User>(`/api/v1/users/${uid}`, token).catch(() => null)
    )
  );
  const authorMap = Object.fromEntries(
    authors.filter(Boolean).map((u) => [u!.id, u!])
  );

  return (
    <div>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <h1 className="font-bold text-xl tracking-tight">Inuminati</h1>
      </header>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <p>まだ投稿がありません</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} author={authorMap[post.userId]} />
          ))}
        </div>
      )}
    </div>
  );
}
