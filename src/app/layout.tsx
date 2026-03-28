import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-[100vh] flex items-center justify-center">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
