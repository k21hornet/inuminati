"use server";

import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { fetcher } from "@/util/fetcher";

type PostData = {
  content: string | null;
  images: {
    imageUrl: string;
    imageOrder: number;
  }[];
};

export const uploadImage = async (formData: FormData): Promise<string> => {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("ファイルが選択されていません");
    }

    // ファイルの拡張子を取得
    const extension = file.name.split(".").pop();
    const timestamp = Date.now();
    const fileName = `post_${timestamp}_${Math.random()
      .toString(36)
      .substring(7)}.${extension}`;

    // uploads/imagesディレクトリのパス
    const uploadsDir = join(process.cwd(), "public", "uploads", "images");

    // ディレクトリが存在しない場合は作成
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // ファイルを保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // 保存されたファイルのパスを返す
    const imageUrl = `/uploads/images/${fileName}`;

    return imageUrl;
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    throw new Error("画像のアップロードに失敗しました");
  }
};

export const createPost = async (postData: PostData) => {
  return fetcher.post("/posts", postData);
};

export const likePost = async (postId: string) => {
  return fetcher.post(`/posts/${postId}/like`);
};
