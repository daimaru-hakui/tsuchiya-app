import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/lib/providers/next-auth-provider";

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
  // if (!session) {
  //   redirect('/login');
  // }
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body className={cn(NotoSans.className, "min-h-dvh")}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
