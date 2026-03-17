import Link from "next/link";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { User } from "@/lib/api/types";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SideNav } from "@/components/layout/side-nav";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  const { token } = await auth0.getAccessToken();

  // 初回ログイン時はここでユーザーを自動作成
  let me: User | null = null;
  try {
    me = await apiFetch.get<User>("/api/v1/users/me", token);
  } catch {
    // バックエンド未起動時もUIは表示する
  }

  return (
    // モバイル: 全幅。PC(md以上): サイドバー風レイアウト
    <div className="flex min-h-screen bg-gray-50">
      {/* PC用サイドナビ */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:bg-white md:px-4 md:py-6 md:sticky md:top-0 md:h-screen">
        <Link href="/feed">
          <h1 className="mb-8 text-xl font-bold tracking-tight">Inuminati</h1>
        </Link>
        <SideNav myUserId={me?.id ?? ""} />
      </aside>

      {/* コンテンツエリア: 常に中央寄せ */}
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-[430px] bg-white md:max-w-[600px] md:border-x">
          <main className="pb-16 md:pb-0">{children}</main>
        </div>
      </div>

      {/* モバイル用ボトムナビ */}
      <div className="md:hidden">
        <BottomNav myUserId={me?.id ?? ""} />
      </div>
    </div>
  );
}
