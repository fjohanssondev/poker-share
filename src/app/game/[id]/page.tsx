"use client"

import { useParams } from "next/navigation";
import Timer from "~/app/_components/timer";
import { api } from "~/trpc/react";

export default function Game() {

  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = api.game.getGameInfo.useQuery(id);
  const utils = api.useUtils()

  const startGame = api.game.startGame.useMutation({
    onSuccess: async () => {
      await utils.game.getGameInfo.invalidate()
    }
  });
  const endGame = api.game.endGame.useMutation({
    onSuccess: async () => {
      await utils.game.getGameInfo.invalidate()
    }
  });

  if (isLoading) {
    return <p>Loading...</p>
  }

  const { createdAt, initialStack, buyIn, startTime, endTime, isFinished } = data ?? {};

  const handleStartGame = (id: string) => {
    startGame.mutate(id)
  }
  const handleEndGame = (id: string) => endGame.mutate(id)

  const stateOfTheGame = () => {
    if (!isFinished && !startTime) {
      return <span className="bg-zinc-200 text-black px-2 py-2 text-xs rounded-sm font-semibold">Game has not started yet</span>
    } else if (!isFinished && startTime) {
      return <span className="bg-amber-500 text-black px-2 py-2 text-xs rounded-sm font-semibold">Game is ongoing</span>
    } else {
      return <span className="bg-emerald-300 text-black px-2 py-2 text-xs rounded-sm font-semibold">The game has finished</span>
    }
  }

  return (
    <section>
      <h1 className="text-5xl font-medium">Game - {id}</h1>
      <div className="flex">
        <div className="flex-1">
          <div className="flex items-center mt-8">
            <h2 className="text-3xl font-medium">Game Info</h2>
            <span className="ml-8">{stateOfTheGame()}</span>
          </div>
          <div className="mt-4">
            <p>The game was created on {createdAt?.toLocaleDateString()}</p>
            <p>Each player started with: <strong>{initialStack}</strong> chips</p>
            <p>Each player bought in with: <strong>{buyIn}</strong></p>
          </div>
          {!startTime ? (
            <button disabled={startGame.isLoading} onClick={() => handleStartGame(id)} className="rounded-sm w-full lg:w-2/3 mt-8 bg-secondary outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-secondary/80" type="submit">
              Start game
            </button>
          ) : (
            <button disabled={endGame.isLoading} onClick={() => handleEndGame(id)} className="rounded-sm w-full lg:w-2/3 mt-8 bg-gray-300 outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-gray-400" type="submit">
              End game
            </button>
          )}
        </div>
        {(startTime && !isFinished) && (
          <div>
            <Timer />
          </div>
        )}
      </div>
    </section>
  )
}
