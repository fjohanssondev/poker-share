"use client"

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function Game() {

  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = api.game.getGameInfo.useQuery(id);


  if (isLoading) {
    return <p>Loading...</p>
  }

  const { createdAt, initialStack, buyIn, startTime } = data ?? {};

  return (
    <section>
      <h1 className="text-5xl font-medium">Game - {id}</h1>
      <h2 className="mt-8 text-3xl font-medium">Game Info</h2>
      <div className="mt-4">
        <p>The game was created on {createdAt?.toLocaleDateString()}</p>
        <p>Each player started with: <strong>{initialStack}</strong> chips</p>
        <p>Each player bought in with: <strong>{buyIn}</strong></p>
      </div>
      {!startTime ? (
        <button className="rounded-sm w-full lg:w-2/3 mt-8 bg-secondary outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-secondary/80" type="submit">
          Start game
        </button>
      ) : (
        <button className="rounded-sm w-full lg:w-2/3 mt-8 bg-gray-300 outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-gray-400" type="submit">
          End game
        </button>
      )}
    </section>
  )
}