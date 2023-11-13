import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";

import Link from "next/link";
import GoBack from "./_components/go-back";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Poker Share",
  description: "Track how much money each have won",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-primary min-h-screen text-white`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {session && (
            <header className="flex py-4 md:p-8">
              <div className="flex items-center justify-between md:justify-end gap-4 container px-8 mx-auto">
                <p className="text-white">
                  <span>Logged in as <strong>{session.user?.name}</strong></span>
                </p>
                <Link
                  href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold shadow-sm no-underline hover:bg-white/20 outline-offset-2"
                >
                  Sign out
                </Link>
              </div>
            </header>
          )}
          <main className={`container ${!session && "h-screen"} flex flex-col px-8 mx-auto py-8`}>
            <div className="self-start mb-8">
              <GoBack />
            </div>
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
