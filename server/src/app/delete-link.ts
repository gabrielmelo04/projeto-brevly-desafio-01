import { makeLeft } from './../shared/either';
import { z } from "zod";
import { ShortLinkRequiredError } from "./errors/short-link-required-error";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq } from "drizzle-orm";
import { ShortLinkNotFoundError } from "./errors/short-link-not-found-error";
import { Either, makeRight } from "@/shared/either";

const deleteLinkSchema = z.object({
  shortLink: z.string(),
});

type DeleteLinkSchema = z.infer<typeof deleteLinkSchema>;

export async function deletelink(data: DeleteLinkSchema): Promise<Either<ShortLinkRequiredError | ShortLinkNotFoundError, { message: string }>> {

  const { shortLink } = deleteLinkSchema.parse(data);

  if (!shortLink) {
    return makeLeft(new ShortLinkRequiredError());
  }

  const shortLinkExists = await db.select()
    .from(schema.links)
    .where(
      eq(schema.links.shortLink, shortLink)
    );

  if (shortLinkExists.length <= 0) {
    return makeLeft(new ShortLinkNotFoundError());
  }

  await db.delete(schema.links).where(eq(schema.links.shortLink, shortLink));

  return makeRight({ message: `Link encurtado - ${shortLink} deletado com sucesso.` });
}