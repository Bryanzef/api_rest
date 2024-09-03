"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
const supertest_1 = __importDefault(require("supertest"));
(0, vitest_1.describe)("Transactions Routes", () => {
    (0, vitest_1.beforeAll)(async () => {
        await app_1.app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app_1.app.close();
    });
    const sessionId = "01436f1c-c2f4-4fd2-91c8-205934266d8f";
    (0, vitest_1.test)("User can create a new Transaction", async () => {
        await (0, supertest_1.default)(app_1.app.server)
            .post("/transactions")
            .set("Cookie", [`sessionId=${sessionId}`])
            .send({
            title: "New Transaction",
            amount: 0,
            type: "debit",
        })
            .expect(201);
    });
    vitest_1.it.only("should be able to lis all transactions", async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .post("/transactions")
            .send({
            title: "New Transaction",
            amount: 0,
            type: "debit",
        });
        const listTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .get("/transactions")
            .set("Cookie", [`sessionId=${sessionId}`])
            .expect(200);
        (0, vitest_1.expect)(listTransactionResponse.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: "New Transaction",
                amount: 0,
            }),
        ]);
    });
});
//01436f1c-c2f4-4fd2-91c8-205934266d8f
