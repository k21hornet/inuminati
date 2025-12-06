import Timeline from "@/components/parts/Timeline";
import { getPosts } from "@/lib/api/post";
import { getProfile } from "@/lib/api/user";
import Image from "next/image";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function Profile({ params }: Props) {
  const { userId } = await params;
  const userIdNumber = parseInt(userId, 10);

  const profile = await getProfile(userIdNumber);
  const postsResponse = await getPosts(userIdNumber);
  const posts = postsResponse.posts;

  return (
    <div className="max-w-4xl mx-auto">
      {/* プロフィールセクション */}
      <div className="flex gap-4 mb-6 p-6 border-b border-gray-300">
        {/* プロフィール画像 */}
        {profile.profileImageUrl ? (
          <Image
            src={profile.profileImageUrl}
            alt="プロフィール画像"
            width={72}
            height={72}
            className="rounded-full"
          />
        ) : (
          <div className="w-18 h-18 rounded-full bg-gray-200"></div>
        )}

        {/* ユーザー情報 */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{profile.userName}</h1>
          {profile.selfIntroduction && (
            <p className="text-gray-700">{profile.selfIntroduction}</p>
          )}
        </div>
      </div>

      {/* 投稿一覧セクション */}
      <h2 className="text-xl font-bold px-6">投稿一覧</h2>
      <Timeline posts={posts} />
    </div>
  );
}
