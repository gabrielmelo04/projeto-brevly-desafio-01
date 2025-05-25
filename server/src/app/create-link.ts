import { Either, makeLeft, makeRight } from "@/shared/either";
import { InvalidShortLink } from "./errors/invalid-short-link";
import { z, ZodError } from "zod";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { ilike } from "drizzle-orm";

const createLinkSchema = z.object({
  shortLink: z.string().regex(/^[a-z][a-z0-9-]*$/, { // Deixei somente o caracter especial '-' conforme o video, sem ser no começo 
    message: "O link encurtado deve consistir apenas de letras minúsculas, sem espaços ou caracteres especiais.",
  }),
  originalLink: z.string().regex(/^(https:\/\/|http:\/\/|www\.)/, {
    message: "Informe uma url válida.",
  }),
});

type CreateLinkSchema = z.infer<typeof createLinkSchema>;

export async function createLink(
  data: CreateLinkSchema
): Promise<Either<InvalidShortLink | ZodError, { message: string }>> {

  const { shortLink, originalLink } = createLinkSchema.parse(data);

  const shortLinkExists = await db.select()
    .from(schema.links)
    .where(
      ilike(schema.links.shortLink, `%${shortLink}`)
    );

  if (shortLinkExists.length >= 1) {
    return makeLeft(new InvalidShortLink());
  }

  try {

    await db.insert(schema.links)
      .values({
        shortLink,
        originalLink,
      });

    return makeRight({ message: 'Link criado com sucesso.' });
  } catch (error) {
    if (error instanceof ZodError) {
      return makeLeft(error);
    }
    throw error;
  }
};