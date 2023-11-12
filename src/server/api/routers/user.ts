import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  search: protectedProcedure.input(z.object({ name: z.string(), email: z.string() })).query(({ ctx, input }) => {

    return ctx.db.user.findMany({
      where: {
        OR: [
          { name: { contains: input.name } },
          { email: { contains: input.email } },
        ],
        NOT: {
          id: ctx.session.user.id
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    });
  }),
});