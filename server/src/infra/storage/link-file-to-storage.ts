import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { Readable } from "node:stream";
import { z } from "zod";
import { r2 } from "./client";
import { env } from "@/env";

const linkFileToStorageSchema = z.object({
  folder: z.enum(['downloads']),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type LinkFileToStorageData = z.infer<typeof linkFileToStorageSchema>;

export async function linkFileToStorage(data: LinkFileToStorageData) {
  const { folder, fileName, contentType, contentStream } = linkFileToStorageSchema.parse(data);

  const fileExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName);

  const sanitizedFileName = fileNameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    ''
  )

  const sanitizedFileNameWithExtension = sanitizedFileName.concat(fileExtension)

  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`

  const uploadResult = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  });

  await uploadResult.done();

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
  }

}