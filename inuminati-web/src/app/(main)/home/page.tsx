import Timeline from "@/components/parts/Timeline";
import { getPosts } from "@/lib/api/post";

export default async function Home() {
  const postsResponse = await getPosts();
  const posts = postsResponse.posts;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 投稿一覧セクション */}
      <Timeline posts={posts} />
    </div>
  );
}
