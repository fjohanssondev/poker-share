export const stateOfTheGame = (hasFinished: boolean | undefined, startTime: Date | null | undefined) => {
  if (!hasFinished && !startTime) {
    return <span className="bg-zinc-200 text-black px-2 py-2 text-xs rounded-sm font-semibold">Game has not started yet</span>
  } else if (!hasFinished && startTime) {
    return <span className="bg-amber-500 text-black px-2 py-2 text-xs rounded-sm font-semibold">Game is ongoing</span>
  } else {
    return <span className="bg-emerald-300 text-black px-2 py-2 text-xs rounded-sm font-semibold">The game has finished</span>
  }
}