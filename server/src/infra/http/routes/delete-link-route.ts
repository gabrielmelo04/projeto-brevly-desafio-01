import { deletelink } from "@/app/delete-link";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";


export const deleteLinkRoute: FastifyPluginAsyncZod = async (app: FastifyInstance) => {

  app.delete('/links/delete/:shortLink', {
    schema: {
      summary: ' Delete link ',
      tags: ['links'],
      params: z.object({
        shortLink: z.string(),
      }),
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
    },
  },
    async (request, reply) => {

      const { shortLink } = request.params as { shortLink: string };

      const result = await deletelink({ shortLink });

      if (isRight(result)) {
        return reply.status(200).send(result.right);
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'ShortLinkNotFoundError':
          return reply.status(404).send({ message: result.left.message });
        case 'ShortLinkRequiredError':
          return reply.status(400).send({ message: result.left.message });
        default:
          return reply.status(400).send({ message: result.left.message });
      }
    }
  );
}