import { exportLinks } from "@/app/export-links";
import { unwrapEither } from "@/shared/either";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const exportLinksRoute: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post('/links/uploads/export', {
    schema: {
      summary: 'Export links',
      tags: ['links'],
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
    }
  },

    async (request, reply) => {
      const result = await exportLinks();

      const { reportUrl } = unwrapEither(result);

      return reply.status(200).send({ message: reportUrl });
    }
  )
}