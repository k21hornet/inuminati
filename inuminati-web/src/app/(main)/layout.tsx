import BottomNavigation from "@/components/base/BottomNavigation";
import Sidebar from "@/components/base/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* デスクトップ用サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">
        <div className="h-full md:p-4 lg:p-8">{children}</div>
      </main>

      {/* モバイル用下部ナビゲーション */}
      <BottomNavigation />
    </div>
  );
}
