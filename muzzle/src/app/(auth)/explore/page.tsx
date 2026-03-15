import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { Post } from "@/lib/api/types";
import { PostGrid } from "@/features/post/post-grid";

export default async function ExplorePage() {
  const { token } = await auth0.getAccessToken();

  const posts = await apiFetch
    .get<Post[]>("/api/v1/posts?limit=60", token)
    .catch(() => [] as Post[]);

  return (
    <div>
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <h1 className="text-center font-semibold">投稿一覧</h1>
      </header>
      <PostGrid posts={posts} />
    </div>
  );
}
