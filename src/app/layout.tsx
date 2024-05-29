import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Header from "@/components/layouts/header/header";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/lib/providers/next-auth-provider";
import MainMenu from "@/components/layouts/sidebar/MainMenu";
import { ToastProvider } from "@/components/toast-provider";

const NotoSans = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TSUCHIYA APP",
  description: "order system",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const session = await auth();
  console.log(session);

  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body
        className={cn(
          NotoSans.className,
          "grid grid-cols-1 md:grid-cols-[250px_1fr] min-h-dvh"
        )}
      >
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MainMenu />
            <div className="md:overflow-auto pb-2 px-4 h-screen">
              <Header />
              <ToastProvider>{children}</ToastProvider>
            </div>
            {/* <Footer /> */}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
