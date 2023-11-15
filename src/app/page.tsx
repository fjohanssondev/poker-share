import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import Games from "./_components/game-list";

export default async function Home() {

  const session = await getServerAuthSession();

  return (
    <div className="container flex flex-col h-full items-center justify-center gap-4 px-4 py-4">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Poker <span className="text-secondary">Share</span>
      </h1>
      {!session && (
        <Link
          href={"/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold shadow-sm no-underline hover:bg-white/20"
        >
          Sign in with Discord
        </Link>
      )}
      {session && <Games />}
    </div>
  );
}