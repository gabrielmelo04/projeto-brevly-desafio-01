import { fastify } from "fastify";
import { fastifyCors } from '@fastify/cors';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { createLinkRoute } from "./routes/create-link-route";
import { deleteLinkRoute } from "./routes/delete-link-route";
import { getOriginalLinkByShortLinkRoute } from "./routes/get-original-link-by-short-link-route";
import { getLinksRoute } from "./routes/get-links-route";
import { changeViewsLinkRoute } from "./routes/change-views-link-route";
import { transformSwaggerSchema } from "./routes/transform-swagger-schema-route";
import { exportLinksRoute } from "./routes/export-links-route";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: 'Internal server error' });
});

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      description: 'Brev.ly API documentation',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(createLinkRoute);
app.register(deleteLinkRoute);
app.register(getOriginalLinkByShortLinkRoute);
app.register(getLinksRoute);
app.register(changeViewsLinkRoute);
app.register(exportLinksRoute);
