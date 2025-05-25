import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeRight } from "@/shared/either";
import { asc, desc, count, ilike } from "drizzle-orm";
import { z } from "zod";

const getLinksSchema = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
});

type GetLinksSchema = z.infer<typeof getLinksSchema>;

type GetLinksOutput = {
  links: {
    id: string;
    shortLink: string;
    originalLink: string;
    views: number;
    createdAt: Date;
  }[];
  totalLinks: number;
};


export async function getLinks(data: GetLinksSchema): Promise<Either<never, GetLinksOutput>> {

  const { searchQuery, sortBy, sortDirection, page, pageSize } = getLinksSchema.parse(data);

  const [links, [{ totalLinks }]] = await Promise.all([
    db.select({
      id: schema.links.id,
      shortLink: schema.links.shortLink,
      originalLink: schema.links.originalLink,
      views: schema.links.views,
      createdAt: schema.links.createdAt,
    })
      .from(schema.links)
      .where(
        searchQuery ? ilike(schema.links.shortLink, `%${searchQuery}%`) : undefined
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),


    db.select({ totalLinks: count(schema.links.id) })
      .from(schema.links)
      .where(
        searchQuery ? ilike(schema.links.shortLink, `%${searchQuery}%`) : undefined
      )
  ]);

  return makeRight({ links, totalLinks });

}