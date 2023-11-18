"use client"

import { z } from "zod";
import type { Session, User } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { api } from "~/trpc/react";

export interface GameFormProps {
  session: Session;
}

export function GameForm({ session }: GameFormProps) {

  const router = useRouter();
  const initialPlayers = session ? [{
    id: session.user?.id,
    name: session.user?.name ?? "",
    image: session.user?.image ?? "",
  }] : [];

  const [players, setPlayers] = useState<User[]>(initialPlayers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buyIn, setBuyIn] = useState<number | null>(null);
  const [initialStack, setInitialStack] = useState<number | null>(null);

  const createGame = api.game.create.useMutation({
    onSuccess: (data) => {
      router.replace(`/game/${data.id}`);
    },
  });

  const { data: listOfPlayers } = api.user.search.useQuery(
    {
      name,
      email,
    },
    {
      enabled: name.length > 0 || email.length > 0,
    }
  );

  const handleSearchPlayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setEmail(e.target.value);
  };

  const handleAddPlayer = (e: React.MouseEvent<HTMLButtonElement>, player: User) => {
    e.preventDefault();

    setPlayers(prev => [...prev, player]);
    setName("");
    setEmail("");
  }

  const handleRemoveUser = (id: string) => setPlayers(prev => prev.filter(player => player.id !== id));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const parsedBuyIn = z.number().parse(buyIn);
        const parsedInitialStack = z.number().parse(initialStack);

        const participantsData = players.map(player => ({
          name: player.name ?? "",
          isRegisteredUser: !!player.id,
          userId: player.id || undefined,
        }));

        createGame.mutate({
          buyIn: parsedBuyIn,
          initialStack: parsedInitialStack,
          participants: participantsData,
        });
      }}
      className="flex flex-col items-start"
    >
      <div className="flex flex-col mt-6 gap-1 w-full lg:w-2/3">
        <label htmlFor="buy-in">Buy in</label>
        <input value={Number(buyIn)} onChange={(e) => setBuyIn(Number(e.target.value))} required min={1} className="rounded-sm bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20" id="buy-in" type="number" placeholder="What's the buy in?" />
      </div>
      <div className="flex flex-col mt-6 gap-1 w-full lg:w-2/3">
        <label htmlFor="initial-stack">Initial stack</label>
        <input value={Number(initialStack)} onChange={(e) => setInitialStack(Number(e.target.value))} required min={1} className="rounded-sm bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20" id="initial-stack" type="number" placeholder="How much does each player start with in value?" />
      </div>
      <div className="flex flex-col mt-6 gap-1 w-full lg:w-2/3">
        <label htmlFor="player">Add players</label>
        <input onChange={handleSearchPlayer} value={name} className="rounded-sm bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20" id="player" type="search" placeholder="Search for a player" />
        {listOfPlayers && (
          <>
            {listOfPlayers?.length > 0 && (
              <div className="mt-2 p-3 rounded-sm bg-white/5">
                {listOfPlayers?.map((player) => (
                  <div key={player.id} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Image width={40} height={40} className="rounded-full border-2 border-white/70" src={player.image ?? ""} alt={player.name ?? ""} />
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <button onClick={(e) => handleAddPlayer(e, player)} className="rounded-full bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20">Add</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col mt-6 gap-1 w-full lg:w-2/3 rounded-sm bg-white/10 p-4">
        <span>Playerlist</span>
        <div className="flex flex-col gap-4 mt-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Image width={40} height={40} className="rounded-full border-2 border-white/70" src={player.image ?? ""} alt={player.name ?? ""} />
                <span className="font-medium">{player.name}</span>
              </div>
              <button onClick={() => handleRemoveUser(player.id)} className="rounded-full bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20">Remove</button>
            </div>
          ))}
        </div>
      </div>
      <button className="rounded-sm w-full lg:w-2/3 mt-8 bg-secondary outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-secondary/80" type="submit">
        Create game
      </button>
    </form>
  )
}