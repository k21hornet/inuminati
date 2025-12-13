export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
