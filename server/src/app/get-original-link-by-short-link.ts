import { Either, makeLeft, makeRight } from './../shared/either';
import { z } from "zod";
import { ShortLinkRequiredError } from "./errors/short-link-required-error";
import { ShortLinkNotFoundError } from "./errors/short-link-not-found-error";
import { schema } from '@/infra/db/schemas';
import { db } from '@/infra/db';
import { eq } from 'drizzle-orm';

const getOriginalLinkByShortLinkSchema = z.object({
  shortLink: z.string(),
});

type GetOriginalLinkByShortLinkSchema = z.infer<typeof getOriginalLinkByShortLinkSchema>;

export async function getOriginalLinkByShortLink(data: GetOriginalLinkByShortLinkSchema): Promise<Either<ShortLinkRequiredError | ShortLinkNotFoundError, { originalLink: string }>> {

  const { shortLink } = getOriginalLinkByShortLinkSchema.parse(data);

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

  //todo
  console.log(shortLinkExists);

  return makeRight({ originalLink: shortLinkExists[0].originalLink });

}