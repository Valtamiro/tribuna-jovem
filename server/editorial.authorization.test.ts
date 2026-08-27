import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { decodeUploadData } from "./routers/editorial";
import type { TrpcContext } from "./_core/context";

function contextWithRole(role: "user" | "admin"): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "student-account",
      name: "Estudante",
      email: "student@example.org",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("área editorial", () => {
  it("bloqueia contas autenticadas que ainda não foram aprovadas pela redação", async () => {
    const caller = appRouter.createCaller(contextWithRole("user"));
    await expect(caller.editorial.admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("aceita apenas um arquivo com o tipo coerente ao dado enviado", () => {
    const encoded = Buffer.from("arquivo seguro").toString("base64");
    expect(decodeUploadData(`data:image/png;base64,${encoded}`, "image/png").toString()).toBe("arquivo seguro");
    expect(() => decodeUploadData(`data:image/png;base64,${encoded}`, "application/pdf")).toThrow();
  });
});
