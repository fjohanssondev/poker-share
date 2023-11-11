"use client"

import { useRouter } from "next/navigation"
import { api } from "~/trpc/react";

export function CreateGame() {

  const router = useRouter();

  const createGame = api.game.create.useMutation({
    onSuccess: () => {
      router.replace("/game:id");
    },
  });

  return (
    <button
      onSubmit={(e) => {
        e.preventDefault();
        createGame.mutate();
      }}
      className="rounded-full bg-white/10 px-10 py-3 shadow-sm font-semibold no-underline transition hover:bg-white/20">
      Create new game
    </button>
  )
}