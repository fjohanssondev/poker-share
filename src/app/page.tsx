import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Poker <span className="text-secondary">Share</span>
        </h1>
        <GameList />
      </div>
    </main>
  );
}

async function GameList() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const games = await api.game.getAll.query();

  return (
    <div className="flex flex-col w-full">
      <h2 className="self-center text-3xl font-semibold mb-4">Gamelist</h2>
      <div className="grid gap-4">
        {games.map(({ id, createdAt }) => (
          <Link key={id} href={`/game/${id}`}>
            <article className="flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white/10 hover:bg-white/20 rounded-lg shadow-sm">
              <div className="text-sm font-medium">
                {new Date(createdAt).toLocaleDateString()}
              </div>
              <div className="text-xl font-semibold">{id}</div>
            </article>
          </Link>
        ))}
      </div>
      <div className="w-1/2 mx-auto h-px bg-white/20 my-8" />
      <Link className="self-center rounded-full bg-white/10 px-10 py-3 shadow-sm font-semibold no-underline hover:bg-white/20" href="/game/create">
        Create new game
      </Link>
    </div>
  );
}