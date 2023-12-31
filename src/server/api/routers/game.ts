import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      where: {
        OR: [
          { createdById: ctx.session.user.id },
          {
            participants: {
              some: {
                userId: ctx.session.user.id,
              }
            }
          }
        ]
      },
    });
  }),

  getGameInfo: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const game = await ctx.db.game.findUnique({
      where: {
        id: input,
      },
      include: {
        createdBy: {
          select: {
            name: true
          }
        },
        participants: true,
      },
    });

    if (!game) return null;

    const isParticipant = game.participants.some(p => p.userId === ctx.session.user.id);
    const isCreator = game.createdById === ctx.session.user.id;

    if (!isParticipant && !isCreator) return null;

    return game;
  }),

  startGame: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.db.game.update({
      where: {
        id: input
      },
      data: {
        startTime: new Date()
      }
    })
  }),

  endGame: protectedProcedure.input(z.object({
    gameId: z.string(), players: z.array(z.object({
      userId: z.string().optional(),
      stack: z.number(),
    }))
  }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.game.update({
        where: {
          id: input.gameId
        },
        data: {
          endTime: new Date(),
          isFinished: true,
          participants: {
            updateMany: input.players.map(p => ({
              where: {
                userId: p.userId
              },
              data: {
                stack: p.stack
              }
            }))
          }
        }
      })
    }),

  create: protectedProcedure.input(z.object({
    buyIn: z.number(),
    initialStack: z.number(),
    participants: z.array(z.object({
      userId: z.string().optional(),
      name: z.string(),
      isRegisteredUser: z.boolean()
    }))
  })).mutation(({ ctx, input }) => {
    return ctx.db.game.create({
      data: {
        buyIn: input.buyIn,
        initialStack: input.initialStack,
        createdBy: { connect: { id: ctx.session.user.id } },
        participants: {
          create: input.participants.map(p => ({
            user: p.userId ? { connect: { id: p.userId } } : undefined,
            name: p.name,
            stack: 0,
            isRegisteredUser: p.isRegisteredUser
          })),
        },
      },
    });
  }),
});