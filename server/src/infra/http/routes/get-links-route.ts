import { getLinks } from "@/app/get-links";
import { unwrapEither } from "@/shared/either";
import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";


export const getLinksRoute: FastifyPluginAsyncZod = async (app: FastifyInstance) => {

  app.get('/links', {
    schema: {
      summary: 'Get all links',
      tags: ['links'],
      consumes: ['application/json'],
      querystring: z.object({
        searchQuery: z.string().optional(),
        sortBy: z.enum(['createdAt']).optional(),
        sortDirection: z.enum(['asc', 'desc']).optional(),
        page: z.coerce.number().optional().default(1),
        pageSize: z.coerce.number().optional().default(20),
      }),
      response: {
        200: z.object({
          links: z.array(z.object({
            id: z.string(),
            shortLink: z.string(),
            originalLink: z.string(),
            views: z.number(),
            createdAt: z.date(),
          })),
          totalLinks: z.number(),
        }),
      },
    },
  },
    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, sortDirection } =
        request.query as {
          page: number;
          pageSize: number;
          searchQuery: string;
          sortBy: 'createdAt' | undefined;
          sortDirection: 'asc' | 'desc' | undefined;
        }

      const result = await getLinks({
        searchQuery,
        sortBy,
        sortDirection,
        page,
        pageSize,
      });

      const { links, totalLinks } = unwrapEither(result);

      return reply.status(200).send({ links, totalLinks });
    }

  )
}