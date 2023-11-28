"use client"

import React, { useEffect, useState } from "react";
import type { Participant } from "@prisma/client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { stateOfTheGame } from "~/lib/state-of-the-game";
import Timer from "~/app/_components/timer";
import { Results } from "~/app/_components/game/results";

export default function Game() {

  const { id } = useParams<{ id: string }>();
  const { data: game, isLoading } = api.game.getGameInfo.useQuery(id);
  const utils = api.useUtils()

  const [players, setPlayers] = useState<Participant[]>([])

  useEffect(() => {
    if (!isLoading && game?.participants) {
      setPlayers(game?.participants)
    }
  }, [isLoading, game?.participants])

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

  // TODO: Use the loading.tsx route instead. Quick fix for now.
  if (isLoading) {
    return <p>Loading...</p>
  }

  // Destructure the game object
  const { createdAt, initialStack, buyIn, startTime, isFinished, createdBy } = game ?? {};

  const handleStartGame = (id: string) => startGame.mutate(id)

  const handleEndGame = (id: string) => {
    const checkStackAddsUp = players.reduce((acc, curr) => acc + Number(curr.stack), 0)
    if (checkStackAddsUp !== initialStack) {
      return alert("The stacks don't add up to the initial stack")
    }

    const playerData = players.map((player) => {
      return {
        userId: player.userId ?? undefined,
        stack: player.stack
      }
    })

    endGame.mutate({ gameId: id, players: playerData })
  }

  const handleChangePlayerStackValue = (e: React.ChangeEvent<HTMLInputElement>, playerId: string) => {
    const updatedValue = e.target.value;
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, stack: Number(updatedValue) } : player
      )
    );
  };

  const gameState = stateOfTheGame(isFinished, startTime)

  return (
    <section>
      <h1 className="text-5xl text-secondary font-semibold">Game</h1>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
        <div className="flex-1 order-2 lg:order-first">
          <div className="flex items-center mt-2 lg:mt-8">
            <h2 className="text-3xl font-medium">Game Info</h2>
            <span className="ml-8">{gameState}</span>
          </div>
          <ul className="mt-4">
            <li>The game was created on {createdAt?.toLocaleDateString()}</li>
            <li>Each player started with: <strong className="text-secondary">{initialStack}</strong> chips</li>
            <li>Each player bought in with: <strong className="text-secondary">{buyIn}</strong></li>
            <li>The game was created by: <strong className="text-secondary">{createdBy?.name}</strong></li>
          </ul>
          {startTime && !isFinished && (
            <>
              <h2 className="text-3xl font-medium mt-8">Players</h2>
              <ul className="flex flex-col gap-4 mt-4">
                {players.map((participant) => (
                  <li key={participant.id}>
                    <label className="flex items-center mb-2">{participant.name}</label>
                    <input onChange={(e) => handleChangePlayerStackValue(e, participant.id)} type="number" className="rounded-sm w-2/3 bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20" placeholder={`Enter the amount ${participant.name} ended with`} />
                  </li>
                ))}
              </ul>
            </>
          )}
          {!startTime && !isFinished && (
            <button disabled={startGame.isLoading} onClick={() => handleStartGame(id)} className="rounded-sm w-full lg:w-2/3 mt-8 bg-secondary outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-secondary/80" type="submit">
              Start game
            </button>
          )}
          {!isFinished && startTime && (
            <button disabled={endGame.isLoading} onClick={() => handleEndGame(id)} className="rounded-sm w-full lg:w-2/3 mt-8 bg-gray-300 outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-gray-400" type="submit">
              End game
            </button>
          )}
        </div>
        {(startTime && !isFinished) && (
          <div className="mt-8 lg:mt-0">
            <Timer gameId={id} />
          </div>
        )}
      </div>
      {isFinished && (
        <div className="mt-8">
          <Results gameId={id} />
        </div>
      )}
    </section>
  )
}
