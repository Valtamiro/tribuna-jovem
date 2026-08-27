import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({ getDb: vi.fn() }));

import { editions, interviews, mediaItems, stories } from "../drizzle/schema";
import {
  createEdition,
  createInterview,
  createMedia,
  getPublicHome,
  getPublishedEditions,
  getPublishedInterviews,
  getPublishedMedia,
  updateEdition,
  updateInterview,
  updateMedia,
  updateStory,
} from "./editorialDb";
import { getDb } from "./db";

const mockedGetDb = vi.mocked(getDb);

function publicQueryDatabase() {
  const rows = new Map<unknown, Array<{ id: number; published: boolean }>>([
    [editions, [{ id: 1, published: true }, { id: 2, published: false }]],
    [stories, [{ id: 3, published: true }, { id: 4, published: false }]],
    [interviews, [{ id: 5, published: true }, { id: 6, published: false }]],
    [mediaItems, [{ id: 7, published: true }, { id: 8, published: false }]],
  ]);
  const where = vi.fn((table: unknown) => {
    const publicRows = (rows.get(table) ?? []).filter(item => item.published);
    const orderedResult = [...publicRows] as Array<{ id: number; published: boolean }> & { limit: (count: number) => Array<{ id: number; published: boolean }> };
    Object.defineProperty(orderedResult, "limit", { value: vi.fn((count: number) => publicRows.slice(0, count)) });
    return { orderBy: vi.fn(() => orderedResult) };
  });
  return {
    database: { select: vi.fn(() => ({ from: vi.fn((table: unknown) => ({ where: vi.fn(() => where(table)) })) })) },
    where,
  };
}

function mutationDatabase() {
  const inserted: Array<Record<string, unknown>> = [];
  const updated: Array<Record<string, unknown>> = [];
  return {
    database: {
      insert: vi.fn(() => ({ values: vi.fn(async (value: Record<string, unknown>) => { inserted.push(value); }) })),
      update: vi.fn(() => ({ set: vi.fn((value: Record<string, unknown>) => ({ where: vi.fn(async () => { updated.push(value); }) })) })),
    },
    inserted,
    updated,
  };
}

describe("persistência editorial", () => {
  beforeEach(() => vi.resetAllMocks());

  it("aplica a consulta pública a todas as coleções e devolve somente registros publicados", async () => {
    const { database, where } = publicQueryDatabase();
    mockedGetDb.mockResolvedValue(database as never);

    const [home, publishedEditions, publishedInterviews, publishedMedia] = await Promise.all([
      getPublicHome(), getPublishedEditions(), getPublishedInterviews(), getPublishedMedia(),
    ]);

    expect(home.latestStories).toEqual([{ id: 3, published: true }]);
    expect(home.latestEditions).toEqual([{ id: 1, published: true }]);
    expect(home.latestInterviews).toEqual([{ id: 5, published: true }]);
    expect(publishedEditions).toEqual([{ id: 1, published: true }]);
    expect(publishedInterviews).toEqual([{ id: 5, published: true }]);
    expect(publishedMedia).toEqual([{ id: 7, published: true }]);
    expect(where).toHaveBeenCalledTimes(6);
  });

  it("persiste a data de publicação e a remove ao devolver uma edição para rascunho", async () => {
    const { database, inserted, updated } = mutationDatabase();
    mockedGetDb.mockResolvedValue(database as never);
    const base = { title: "Edição de teste", issueLabel: "Edição 01", description: "Descrição de teste suficientemente longa", published: false };

    await createEdition(base, 4);
    await updateEdition(1, { ...base, published: true });
    await updateEdition(1, { ...base, published: false });

    expect(inserted[0]).toMatchObject({ published: false, publishedAt: null, createdBy: 4 });
    expect(updated[0]).toMatchObject({ published: true });
    expect(updated[0]?.publishedAt).toBeInstanceOf(Date);
    expect(updated[1]).toMatchObject({ published: false, publishedAt: null });
  });

  it("mantém entrevistas e materiais fora do acesso público até a equipe marcá-los como publicados", async () => {
    const { database, inserted, updated } = mutationDatabase();
    mockedGetDb.mockResolvedValue(database as never);

    await createInterview({ title: "Entrevista", interviewee: "Convidada", presenter: "Estudante", description: "Descrição ampla da conversa", published: false }, 4);
    await createMedia({ title: "Capa da edição", assetType: "image", url: "https://example.org/capa.jpg", published: false }, 4);
    await updateMedia(2, { title: "Capa da edição", assetType: "image", url: "https://example.org/capa.jpg", published: true });
    await updateInterview(3, { title: "Entrevista", interviewee: "Convidada", presenter: "Estudante", description: "Descrição ampla da conversa", published: true });
    await updateInterview(3, { title: "Entrevista", interviewee: "Convidada", presenter: "Estudante", description: "Descrição ampla da conversa", published: false });
    await updateStory(4, { title: "Matéria", summary: "Resumo de uma matéria da redação", body: "Texto completo de uma matéria preparada pela turma para o jornal.", authorName: "Estudante", category: "Direitos", published: true });
    await updateStory(4, { title: "Matéria", summary: "Resumo de uma matéria da redação", body: "Texto completo de uma matéria preparada pela turma para o jornal.", authorName: "Estudante", category: "Direitos", published: false });

    expect(inserted[0]).toMatchObject({ published: false, publishedAt: null, createdBy: 4 });
    expect(inserted[1]).toMatchObject({ published: false, createdBy: 4 });
    expect(updated[0]).toMatchObject({ published: true });
    expect(updated[2]).toMatchObject({ published: false, publishedAt: null });
    expect(updated[4]).toMatchObject({ published: false, publishedAt: null });
  });
});
