import { getPost } from "@/lib/api/post";
import Image from "next/image";

type Props = {
  params: Promise<{ postId: string }>;
};

type PostImage = {
  postImageId: number;
  imageUrl: string;
  imageOrder: number;
};

export default async function Post({ params }: Props) {
  const { postId } = await params;

  const post = await getPost(postId);

  return (
    <div className="flex gap-4 w-full h-full">
      <div className="max-w-2xl h-full bg-black">
        <div
          key={post.postImages[0].postImageId}
          className="flex items-center h-full"
        >
          <Image
            src={post.postImages[0].imageUrl}
            alt={post.postImages[0].imageUrl}
            width={1000}
            height={1000}
            className="my-auto w-full max-h-full"
          />
        </div>
      </div>

      <div className="flex-1 h-full">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-300">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="font-bold">Test User</div>
        </div>

        <div className="py-4 border-b border-gray-300">
          {post.content && <p>{post.content}</p>}
        </div>

        <div className="py-4">コメント</div>
      </div>
    </div>
  );
}
