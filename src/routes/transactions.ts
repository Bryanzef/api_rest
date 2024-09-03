import "dotenv/config";
import type { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (req, rep) => {
    console.log(`[${req.method}] [${req.url}]`);
  });
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, rep) => {
      const { sessionId } = req.cookies;
      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

      return { transactions };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const getTransactionParmsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParmsSchema.parse(req.params);

      const { sessionId } = req.cookies;

      const transaction = await knex("transactions")
        .where({
          session_id: sessionId,
          id,
        })

        .first();

      return { transaction };
    }
  );

  app.get(
    "/sumary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;

      const sumary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: " amount" })
        .first();

      return { sumary };
    }
  );

  app.post(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, rep) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(["credit", "debit"]),
      });
      //
      const { title, amount, type } = createTransactionBodySchema.parse(
        req.body
      );

      let sessionId = req.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();

        rep.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      await knex("transactions").insert({
        id: randomUUID(),
        title,
        amount: type == "credit" ? amount : amount * -1,
        session_id: sessionId,
      });

      return rep.status(201).send();
    }
  );
}
