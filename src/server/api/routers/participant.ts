import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const participantRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.participant.findMany();
  }),

  search: protectedProcedure.input(z.object({ name: z.string(), email: z.string() })).query(({ ctx, input }) => {

    let filter: {
      name?: { contains: string },
      email?: { contains: string }
    } = {};

    if (input.name.length > 0) {
      filter = {
        name: { contains: input.name },
      }
    }

    if (input.email.length > 0) {
      filter = {
        ...filter,
        email: { contains: input.email }
      }
    }

    return ctx.db.user.findMany({
      where: filter,
    });
  }),
});