import { GameForm } from "~/app/_components/create-game";
import { getServerAuthSession } from "~/server/auth";

export default async function CreateGame() {

  const session = await getServerAuthSession();

  if (!session?.user) return null;

  return (
    <section>
      <h1 className="text-5xl font-medium">Create Game</h1>
      <GameForm session={session} />
    </section>
  )
}