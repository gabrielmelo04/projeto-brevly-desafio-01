import { createLink } from "@/app/create-link";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z, ZodError } from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async (app: FastifyInstance) => {

  app.post('/links', {
    schema: {
      summary: 'Create link',
      tags: ['links'],
      consumes: ['application/json'],
      body: z.object({
        shortLink: z.string().regex(/^[a-z][a-z0-9-]*$/, { // Deixei somente o caracter especial '-' conforme o video, sem ser no começo 
          message: "O link encurtado deve consistir apenas de letras minúsculas, sem espaços ou caracteres especiais.",
        }),
        originalLink: z.string().regex(/^(https:\/\/|http:\/\/|www\.)/, {
          message: "Informe uma url válida.",
        }),
      }),
      response: {
        201: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
        409: z
          .object({
            message: z.string(),
          })
          .describe('Link encurtado já existe.'),
      },
    },
  },
    async (request, reply) => {
      const link = request.body as { shortLink: string; originalLink: string };

      const result = await createLink({
        shortLink: link.shortLink,
        originalLink: link.originalLink,
      });

      if (isRight(result)) {
        return reply.status(201).send(result.right);
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'InvalidShortLink':
          return reply.status(400).send({ message: error.message });
        case 'ZodError':
          if (error instanceof ZodError) {
            return reply.status(409).send({ message: error.errors[0].message });
          }
          return reply.status(409).send({ message: 'Typing error.' });
        default:
          return reply.status(400).send(result.left.message);
      }

    }
  )
}