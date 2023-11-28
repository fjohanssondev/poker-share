'use client'

import type { Participant } from "@prisma/client"
import { api } from "~/trpc/react"
import { Crown } from "lucide-react"

export const sortPlayersDescendingByStack = (arr: Participant[] | undefined) => {
  if (!arr) return []

  return arr.sort((a, b) => a.stack - b.stack)
}

export function Results({ gameId }: { gameId: string }) {

  const { data: game } = api.game.getGameInfo.useQuery(gameId)

  const sortedParticipants = sortPlayersDescendingByStack(game?.participants)

  return (
    <section>
      <h2 className="text-3xl font-medium">Results</h2>
      <ul className="flex flex-col gap-2 mt-4">
        {sortedParticipants.map((participant, idx) => (
          <li className="flex flex-col" key={participant.userId}>
            <div className="flex items-center">
              <strong className="text-xl">{participant.name}:</strong>
              {idx === 0 && <Crown className="text-secondary ml-2" />}
            </div>
            <span className="my-2">Ended with <strong className="text-secondary">{participant.stack}</strong></span>
          </li>
        ))}
      </ul>
    </section>
  )
}