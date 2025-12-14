import Image from "next/image";
import Link from "next/link";

type Props = {
  posts: Post[];
};

type Post = {
  postId: number;
  userId: number;
  content?: string;
  postImages: PostImage[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

type PostImage = {
  postImageId: number;
  imageUrl: string;
  imageOrder: number;
};

export default function Timeline({ posts }: Props) {
  return (
    <div className="grid grid-cols-3 gap-1 md:p-6">
      {posts.map((post) => (
        <Link href={`/posts/${post.postId}`} key={post.postId}>
          <Image
            src={post.postImages[0].imageUrl}
            alt="投稿画像"
            width={300}
            height={300}
            className="w-full h-full object-cover aspect-square"
          />
        </Link>
      ))}
    </div>
  );
}
