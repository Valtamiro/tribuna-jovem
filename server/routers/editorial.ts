import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as editorialDb from "../editorialDb";
import { storagePut } from "../storage";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const emptyOrUrl = z.union([
  z.string().trim().url("Informe uma URL válida.").max(1800),
  z.literal(""),
]).transform(value => value || undefined);

const editionInput = z.object({
  title: z.string().trim().min(3).max(220),
  issueLabel: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(5000),
  documentUrl: emptyOrUrl,
  coverUrl: emptyOrUrl,
  published: z.boolean(),
});

const storyInput = z.object({
  editionId: z.number().int().positive().optional(),
  title: z.string().trim().min(3).max(220),
  summary: z.string().trim().min(10).max(1200),
  body: z.string().trim().min(20).max(30000),
  authorName: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(80),
  coverUrl: emptyOrUrl,
  published: z.boolean(),
});

const interviewInput = z.object({
  title: z.string().trim().min(3).max(220),
  interviewee: z.string().trim().min(2).max(180),
  presenter: z.string().trim().min(2).max(180),
  description: z.string().trim().min(10).max(5000),
  transcript: z.string().trim().max(30000).optional(),
  videoUrl: emptyOrUrl,
  coverUrl: emptyOrUrl,
  published: z.boolean(),
});

const mediaInput = z.object({
  title: z.string().trim().min(2).max(220),
  description: z.string().trim().max(3000).optional(),
  assetType: z.enum(["image", "document"]),
  url: z.string().trim().url("Informe uma URL válida.").max(1800),
  storageKey: z.string().trim().max(512).optional(),
  mimeType: z.string().trim().max(120).optional(),
  published: z.boolean(),
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
type AllowedMimeType = (typeof allowedMimeTypes)[number];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function decodeUploadData(dataUrl: string, mimeType: AllowedMimeType): Buffer {
  const expectedPrefix = `data:${mimeType};base64,`;
  if (!dataUrl.startsWith(expectedPrefix)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "O tipo declarado não corresponde ao arquivo enviado." });
  }
  const encoded = dataUrl.slice(expectedPrefix.length);
  if (!encoded || !/^[A-Za-z0-9+/=]+$/.test(encoded)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "O arquivo enviado está em formato inválido." });
  }
  const buffer = Buffer.from(encoded, "base64");
  if (!buffer.length || buffer.length > MAX_UPLOAD_BYTES) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Envie arquivos de até 10 MB." });
  }
  return buffer;
}

function safeFileStem(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").slice(0, 80) || "arquivo";
}

function extensionFor(mimeType: AllowedMimeType) {
  return mimeType === "application/pdf" ? "pdf" : mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
}

export const editorialRouter = router({
  public: router({
    home: publicProcedure.query(() => editorialDb.getPublicHome()),
    editions: publicProcedure.query(() => editorialDb.getPublishedEditions()),
    interviews: publicProcedure.query(() => editorialDb.getPublishedInterviews()),
    gallery: publicProcedure.query(() => editorialDb.getPublishedMedia()),
  }),
  admin: router({
    overview: adminProcedure.query(() => editorialDb.getAdminOverview()),
    createEdition: adminProcedure.input(editionInput).mutation(({ input, ctx }) => editorialDb.createEdition(input, ctx.user.id)),
    updateEdition: adminProcedure.input(z.object({ id: z.number().int().positive(), data: editionInput })).mutation(({ input }) => editorialDb.updateEdition(input.id, input.data)),
    createStory: adminProcedure.input(storyInput).mutation(({ input, ctx }) => editorialDb.createStory(input, ctx.user.id)),
    updateStory: adminProcedure.input(z.object({ id: z.number().int().positive(), data: storyInput })).mutation(({ input }) => editorialDb.updateStory(input.id, input.data)),
    createInterview: adminProcedure.input(interviewInput).mutation(({ input, ctx }) => editorialDb.createInterview(input, ctx.user.id)),
    updateInterview: adminProcedure.input(z.object({ id: z.number().int().positive(), data: interviewInput })).mutation(({ input }) => editorialDb.updateInterview(input.id, input.data)),
    createMedia: adminProcedure.input(mediaInput).mutation(({ input, ctx }) => editorialDb.createMedia(input, ctx.user.id)),
    updateMedia: adminProcedure.input(z.object({ id: z.number().int().positive(), data: mediaInput })).mutation(({ input }) => editorialDb.updateMedia(input.id, input.data)),
    uploadMedia: adminProcedure.input(z.object({
      title: z.string().trim().min(2).max(220),
      fileName: z.string().trim().min(1).max(180),
      mimeType: z.enum(allowedMimeTypes),
      dataUrl: z.string().min(20).max(14 * 1024 * 1024),
    })).mutation(async ({ input, ctx }) => {
      const buffer = decodeUploadData(input.dataUrl, input.mimeType);
      const filename = `${Date.now()}-${safeFileStem(input.fileName)}.${extensionFor(input.mimeType)}`;
      const stored = await storagePut(`redacao/${ctx.user.id}/${filename}`, buffer, input.mimeType);
      const assetType = input.mimeType === "application/pdf" ? "document" : "image";
      await editorialDb.createMedia({
        title: input.title,
        assetType,
        url: stored.url,
        storageKey: stored.key,
        mimeType: input.mimeType,
        published: false,
      }, ctx.user.id);
      return { url: stored.url, key: stored.key, assetType };
    }),
  }),
});
