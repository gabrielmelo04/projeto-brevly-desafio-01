import { getOriginalLinkByShortLink } from "@/app/get-original-link-by-short-link";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";


export const getOriginalLinkByShortLinkRoute: FastifyPluginAsync = async (app: FastifyInstance) => {

  app.get('/links/:shortLink', {
    schema: {
      summary: 'Get original link by short link',
      tags: ['links'],
      params: z.object({
        shortLink: z.string(),
      }),
      response: {
        200: z.object({
          originalLink: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
  },
    async (request, reply) => {
      const { shortLink } = request.params as { shortLink: string };

      const result = await getOriginalLinkByShortLink({ shortLink });

      if (isRight(result)) {
        return reply.status(200).send(result.right);
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'ShortLinkRequiredError':
          return reply.status(400).send({ message: error.message });
        case 'ShortLinkNotFoundError':
          return reply.status(404).send({ message: error.message });
        default:
          return reply.status(400).send({ message: result.left.message });
      }
    }
  )
}