import { createTRPCRouter } from "~/server/api/trpc";
import { gameRouter } from "~/server/api/routers/game";
import { participantRouter } from "./routers/participant";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  game: gameRouter,
  participant: participantRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
