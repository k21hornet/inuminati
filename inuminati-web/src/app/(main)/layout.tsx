import Sidebar from "@/components/base/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
