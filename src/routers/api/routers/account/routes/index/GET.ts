import { FastifyRequest, FastifyReply } from "fastify";
import { TokenPayload } from "@/utils/jwt";
import db from "@/utils/db";

export default async (
  req: FastifyRequest,
  reply: FastifyReply,
  token: TokenPayload,
) => {
  const account = await db.account.findUnique({
    where: {
      id: token.id,
    },

    select: {
      username: true,
      email: true,
    },
  });

  if (!account) {
    reply.status(404).send({
      message: "Account not found",
      payload: null,
    });

    return;
  }

  reply.send({
    message: "Success",
    payload: {
      username: account.username,
      email: account.email,
    },
  });
};
