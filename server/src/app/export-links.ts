import { db, pg } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { linkFileToStorage } from "@/infra/storage/link-file-to-storage"
import { type Either, makeRight } from "@/shared/either"
import { stringify } from "csv-stringify"
import { PassThrough, Readable, Transform } from "node:stream"
import { pipeline } from "node:stream/promises"

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(): Promise<Either<never, ExportLinksOutput>> {

  const { sql, params } = db
    .select({
      id: schema.links.id,
      shortLink: schema.links.shortLink,
      originalLink: schema.links.originalLink,
      views: schema.links.views,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(30);

  const cursorStream = Readable.from(cursor) // transforma cursor em stream legível

  const csv = stringify({
    header: true,
    delimiter: ';',
    columns: [
      { key: 'original_link', header: 'URL original' },
      { key: 'short_link', header: 'URL encurtada' },
      { key: 'views', header: 'Contagem de acessos' },
      { key: 'created_at', header: 'Data de criação' },
    ]
  });

  const linkToStorageStream = new PassThrough();

  const convertToCSVPipeline = await pipeline(
    cursorStream,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }
        callback()
      },
    }),
    csv,
    linkToStorageStream
  );

  const linkToStorage = await linkFileToStorage({
    folder: 'downloads',
    contentType: 'text/csv',
    fileName: `${new Date().toISOString()}-links-upload.csv`,
    contentStream: linkToStorageStream,
  });

  const [{ url }] = await Promise.all([linkToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url });
}