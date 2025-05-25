import { Either, makeLeft, makeRight } from "@/shared/either";
import { ShortLinkRequiredError } from "./errors/short-link-required-error";
import { ShortLinkNotFoundError } from "./errors/short-link-not-found-error";
import { z } from "zod";
import { schema } from "@/infra/db/schemas";
import { eq } from "drizzle-orm";
import { db } from "@/infra/db";

const changeViewsLinkSchema = z.object({
  shortLink: z.string(),
});

type ChangeViewsLinkSchema = z.infer<typeof changeViewsLinkSchema>;

export async function changeViewsLink(data: ChangeViewsLinkSchema): Promise<Either<ShortLinkRequiredError | ShortLinkNotFoundError, { message: string }>> {

  const { shortLink } = changeViewsLinkSchema.parse(data);

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

  try {
    await db.update(schema.links)
      .set({ views: shortLinkExists[0].views + 1 })
      .where(eq(schema.links.shortLink, shortLink));

    return makeRight({ message: `Link encurtado - ${shortLink} views alterado com sucesso.` });
  } catch (error) {
    throw error;
  }
}