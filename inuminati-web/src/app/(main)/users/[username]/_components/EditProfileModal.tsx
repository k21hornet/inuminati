"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProfileData = {
  nickname: string;
  userName: string;
  selfIntroduction: string;
  profileImageUrl?: string;
};

type EditProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProfileData;
};

export default function EditProfileModal({
  open,
  onOpenChange,
  initialData,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.profileImageUrl || null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // TODO: API呼び出しを実装
    console.log("保存するデータ:", {
      ...formData,
      profileImage: selectedImage,
    });
    // API呼び出し後にモーダルを閉じる
    onOpenChange(false);
  };

  const handleCancel = () => {
    // フォームデータをリセット
    setFormData(initialData);
    setSelectedImage(null);
    setPreviewUrl(initialData.profileImageUrl || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
          <DialogDescription>
            プロフィール情報を編集できます。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="nickname" className="text-sm font-medium">
              ニックネーム
            </label>
            <Input
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="ニックネームを入力"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="userName" className="text-sm font-medium">
              ユーザーネーム
            </label>
            <Input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="ユーザーネームを入力"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="selfIntroduction" className="text-sm font-medium">
              自己紹介
            </label>
            <Textarea
              id="selfIntroduction"
              name="selfIntroduction"
              value={formData.selfIntroduction}
              onChange={handleInputChange}
              placeholder="自己紹介を入力"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="profileImage" className="text-sm font-medium">
              プロフィール画像を選択
            </label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={previewUrl}
                    alt="プロフィール画像プレビュー"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
