"use client";

import { createPost, uploadImage } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePost() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadedImageUrl = await uploadImage(formData);
      setImageUrl(uploadedImageUrl);
    } catch (error) {
      console.error("アップロードエラー:", error);
      alert("画像のアップロードに失敗しました");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData = {
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
    <div className="p-4 md:p-0">
      <h1 className="text-2xl font-bold">新規投稿</h1>

      <form onSubmit={handleSubmit}>
        <Input
          type="file"
          placeholder="画像をアップロード"
          onChange={handleImageUpload}
        />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="投稿画像"
            width={400}
            height={400}
            className="object-cover"
          />
        )}
        <Textarea name="content" placeholder="投稿内容" rows={2} />
        <Button type="submit" className="w-full md:w-24">
          投稿
        </Button>
      </form>
    </div>
  );
}
