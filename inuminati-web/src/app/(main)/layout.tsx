import Sidebar from "@/component/base/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
