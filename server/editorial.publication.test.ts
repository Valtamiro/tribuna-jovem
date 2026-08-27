import { describe, expect, it } from "vitest";
import { onlyPublished, publicationFields } from "./editorialDb";

describe("regras de visibilidade pública", () => {
  it("exibe somente itens publicados nas coleções destinadas à comunidade", () => {
    const items = [
      { id: 1, title: "Rascunho", published: false },
      { id: 2, title: "Publicação", published: true },
      { id: 3, title: "Outro rascunho", published: false },
    ];

    expect(onlyPublished(items)).toEqual([{ id: 2, title: "Publicação", published: true }]);
  });

  it("registra data quando um conteúdo é publicado e remove a data ao voltar a rascunho", () => {
    const publicacao = publicationFields(true);
    const rascunho = publicationFields(false);

    expect(publicacao.published).toBe(true);
    expect(publicacao.publishedAt).toBeInstanceOf(Date);
    expect(rascunho).toEqual({ published: false, publishedAt: null });
  });
});

