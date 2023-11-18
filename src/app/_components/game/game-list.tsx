"use client"

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export interface Game {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isFinished: boolean;
  timer: number;
  buyIn: number;
  initialStack: number;
  startTime: Date;
  endTime: Date;
  createdBy: string;
  createdById: string;
}

export default function Games() {

  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = api.game.getAll.useQuery<Game[]>();

  const games = data?.filter(game => game.createdAt.toLocaleDateString().includes(searchQuery));

  return (
    <>
      <input onChange={(e) => setSearchQuery(e.target.value)} type="search" value={searchQuery} placeholder="Filter your games based on date" className="flex w-full lg:my-4 lg:w-2/3 outline-offset-2 text-center rounded-full bg-white/10 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20" />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <GameList games={games ?? []} />
      )}
    </>
  )
}

function GameList({ games }: { games: Game[] }) {

  return (
    <div className="flex flex-col w-full">
      <h2 className="self-center text-3xl font-semibold mb-4">Gamelist</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-auto gap-4">
        {games.map(({ id, createdAt }) => (
          <Link key={id} href={`/game/${id}`}>
            <article className="flex flex-col items-center outline-offset-2 justify-center gap-2 px-4 py-8 bg-white/10 hover:bg-white/20 rounded-lg shadow-sm">
              <div className="text-sm font-medium">
                {new Date(createdAt).toLocaleDateString()}
              </div>
              <div className="text-xl font-semibold">{id}</div>
            </article>
          </Link>
        ))}
      </div>
      <div className="w-1/2 mx-auto h-px bg-white/20 my-8" />
      <Link className="self-center rounded-full bg-secondary outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-secondary/80" href="/game/create">
        Create new game
      </Link>
    </div>
  );
}