import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-[100vh] flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
