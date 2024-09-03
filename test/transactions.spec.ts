import { expect, test, beforeAll, afterAll, describe, it } from "vitest";
import { app } from "../src/app";
import request from "supertest";

describe("Transactions Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const sessionId = "01436f1c-c2f4-4fd2-91c8-205934266d8f";
  test("User can create a new Transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .set("Cookie", [`sessionId=${sessionId}`])
      .send({
        title: "New Transaction",
        amount: 0,
        type: "debit",
      })
      .expect(201);
  });
  it.only("should be able to lis all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")

      .send({
        title: "New Transaction",
        amount: 0,
        type: "debit",
      });

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", [`sessionId=${sessionId}`])
      .expect(200);

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New Transaction",
        amount: 0,
      }),
    ]);
  });
});

//01436f1c-c2f4-4fd2-91c8-205934266d8f
