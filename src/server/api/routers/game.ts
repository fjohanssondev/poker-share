import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  create: protectedProcedure.input(z.object({ buyIn: z.number(), initialStack: z.number() })).mutation(({ ctx, input }) => {
    return ctx.db.game.create({
      data: {
        buyIn: input.buyIn,
        initialStack: input.initialStack,
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });
  }),
});