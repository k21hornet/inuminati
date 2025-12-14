import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが選択されていません" },
        { status: 400 }
      );
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

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
