import { desc, eq } from "drizzle-orm";
import { editions, interviews, mediaItems, stories } from "../drizzle/schema";
import { getDb } from "./db";

type EditionPayload = { title: string; issueLabel: string; description: string; documentUrl?: string; coverUrl?: string; published: boolean };
type StoryPayload = { editionId?: number; title: string; summary: string; body: string; authorName: string; category: string; coverUrl?: string; published: boolean };
type InterviewPayload = { title: string; interviewee: string; presenter: string; description: string; transcript?: string; videoUrl?: string; coverUrl?: string; published: boolean };
type MediaPayload = { title: string; description?: string; assetType: "image" | "document"; url: string; storageKey?: string; mimeType?: string; published: boolean };

export function onlyPublished<T extends { published: boolean }>(items: readonly T[]) { return items.filter(item => item.published); }
export function publicationFields(published: boolean) { return { published, publishedAt: published ? new Date() : null }; }

async function database() {
  const db = await getDb();
  if (!db) throw new Error("O banco de dados não está disponível no momento.");
  return db;
}

export async function getPublicHome() {
  const db = await database();
  const [latestStories, latestEditions, latestInterviews] = await Promise.all([
    db.select().from(stories).where(eq(stories.published, true)).orderBy(desc(stories.publishedAt)).limit(3),
    db.select().from(editions).where(eq(editions.published, true)).orderBy(desc(editions.publishedAt)).limit(3),
    db.select().from(interviews).where(eq(interviews.published, true)).orderBy(desc(interviews.publishedAt)).limit(2),
  ]);
  return { latestStories, latestEditions, latestInterviews };
}

export async function getPublishedEditions() { const db = await database(); return db.select().from(editions).where(eq(editions.published, true)).orderBy(desc(editions.publishedAt)); }
export async function getPublishedInterviews() { const db = await database(); return db.select().from(interviews).where(eq(interviews.published, true)).orderBy(desc(interviews.publishedAt)); }
export async function getPublishedMedia() { const db = await database(); return db.select().from(mediaItems).where(eq(mediaItems.published, true)).orderBy(desc(mediaItems.createdAt)); }

export async function getAdminOverview() {
  const db = await database();
  const [allEditions, allStories, allInterviews, allMedia] = await Promise.all([
    db.select().from(editions).orderBy(desc(editions.updatedAt)),
    db.select().from(stories).orderBy(desc(stories.updatedAt)),
    db.select().from(interviews).orderBy(desc(interviews.updatedAt)),
    db.select().from(mediaItems).orderBy(desc(mediaItems.updatedAt)),
  ]);
  return { editions: allEditions, stories: allStories, interviews: allInterviews, media: allMedia };
}

export async function createEdition(payload: EditionPayload, userId: number) { const db = await database(); await db.insert(editions).values({ ...payload, documentUrl: payload.documentUrl ?? null, coverUrl: payload.coverUrl ?? null, ...publicationFields(payload.published), createdBy: userId }); }
export async function updateEdition(id: number, payload: EditionPayload) { const db = await database(); await db.update(editions).set({ ...payload, documentUrl: payload.documentUrl ?? null, coverUrl: payload.coverUrl ?? null, ...publicationFields(payload.published), updatedAt: new Date() }).where(eq(editions.id, id)); }
export async function createStory(payload: StoryPayload, userId: number) { const db = await database(); await db.insert(stories).values({ ...payload, editionId: payload.editionId ?? null, coverUrl: payload.coverUrl ?? null, ...publicationFields(payload.published), createdBy: userId }); }
export async function updateStory(id: number, payload: StoryPayload) { const db = await database(); await db.update(stories).set({ ...payload, editionId: payload.editionId ?? null, coverUrl: payload.coverUrl ?? null, ...publicationFields(payload.published), updatedAt: new Date() }).where(eq(stories.id, id)); }
export async function createInterview(payload: InterviewPayload, userId: number) { const db = await database(); await db.insert(interviews).values({ ...payload, transcript: payload.transcript ?? null, videoUrl: payload.videoUrl ?? null, coverUrl: payload.coverUrl ?? null, ...publicationFields(payload.published), createdBy: userId }); }
export async function updateInterview(id: number, payload: InterviewPayload) { const db = await database(); await db.update(interviews).set({ ...payload, transcript: payload.transcript ?? null, videoUrl: payload.videoUrl ?? null, coverUrl: payload.coverUrl ?? null, ...publicationFields(payload.published), updatedAt: new Date() }).where(eq(interviews.id, id)); }
export async function createMedia(payload: MediaPayload, userId: number) { const db = await database(); await db.insert(mediaItems).values({ ...payload, description: payload.description ?? null, storageKey: payload.storageKey ?? null, mimeType: payload.mimeType ?? null, createdBy: userId }); }
export async function updateMedia(id: number, payload: MediaPayload) { const db = await database(); await db.update(mediaItems).set({ ...payload, description: payload.description ?? null, storageKey: payload.storageKey ?? null, mimeType: payload.mimeType ?? null, updatedAt: new Date() }).where(eq(mediaItems.id, id)); }
