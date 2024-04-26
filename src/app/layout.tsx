import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

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
  console.log(session?.user.uid);
  // if (!session) {
  //   redirect('/login');
  // }
  return (
    <html lang="ja">
      <body className={cn(NotoSans.className, "min-h-dvh")}>
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
      </body>
    </html>
  );
}
