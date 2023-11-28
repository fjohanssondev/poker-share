'use client'

import { api } from "~/trpc/react"

export function Results({ gameId }: { gameId: string }) {

  const { data: game } = api.game.getGameInfo.useQuery(gameId)

  const determineWinnerOrder = () => {
    if (!game?.participants) return null
    const sortedParticipants = game.participants.sort((a, b) => b.stack - a.stack)
    return sortedParticipants.map((participant, index) => {
      return {
        ...participant,
        place: index + 1
      }
    })
  }

  return (
    <section>
      <h2 className="text-3xl font-medium">Results</h2>
      {JSON.stringify(game)}
    </section>
  )
}