"use client";

import { createPost, uploadImage } from "@/lib/api/post";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePost() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedImageUrl = await uploadImage(file);
    setImageUrl(uploadedImageUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData = {
      userId: "1", // TODO: 実際のユーザーIDを取得
      content: (e.target as HTMLFormElement).content.value || null,
      images: [
        {
          imageUrl: imageUrl as string,
          imageOrder: 1,
        },
      ],
    };

    const response = await createPost(postData);
    if (response) {
      router.push(`/posts/${response.postId}`);
    }
  };

  return (
    <div>
      <h1>新規投稿</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageUpload} />
        {imageUrl && <img src={imageUrl} alt="Uploaded" />}
        <textarea name="content" placeholder="投稿内容" />
        <button type="submit">投稿</button>
      </form>
    </div>
  );
}
