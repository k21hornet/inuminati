"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditProfileModal from "./EditProfileModal";

type ProfileData = {
  nickname: string;
  userName: string;
  selfIntroduction: string;
  profileImageUrl?: string;
};

type EditProfileButtonProps = {
  profile: ProfileData;
};

export default function EditProfileButton({ profile }: EditProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="flex-1 lg:w-48"
        onClick={() => setIsOpen(true)}
      >
        プロフィールを編集
      </Button>
      <EditProfileModal
        open={isOpen}
        onOpenChange={setIsOpen}
        initialData={{
          nickname: profile.nickname,
          userName: profile.userName,
          selfIntroduction: profile.selfIntroduction || "",
          profileImageUrl: profile.profileImageUrl,
        }}
      />
    </>
  );
}

