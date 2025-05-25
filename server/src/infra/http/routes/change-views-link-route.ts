import { changeViewsLink } from "@/app/change-views-link";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";


export const changeViewsLinkRoute: FastifyPluginAsync = async (app: FastifyInstance) => {

  app.put('/links/update-views/:shortLink', {
    schema: {
      summary: 'Change link views',
      tags: ['links'],
      params: z.object({
        shortLink: z.string(),
      }),
      consumes: ['application/json'],
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },

    }
  },
    async (request, reply) => {
      const { shortLink } = request.params as { shortLink: string };

      const result = await changeViewsLink({ shortLink });

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
          return reply.status(500).send({ message: error.message });
      }

    }
  )
}