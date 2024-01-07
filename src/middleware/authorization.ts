import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { TokenPayload } from "../utils/jwt";
import logger from "@/utils/logger";

export default (
  route: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: FastifyRequest<any>,
    reply: FastifyReply,
    token: TokenPayload,
  ) => unknown,
) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.headers.authorization) {
      reply.status(400).send({
        message: "Missing authorization header",
        payload: null,
      });

      return;
    }

    try {
      const [scheme, token] = req.headers.authorization.split(" ");

      if (scheme.toLowerCase() !== "bearer") {
        reply.status(400).send({
          message: "Malformed authorization header",
          payload: null,
        });

        return;
      }

      await route(req, reply, await jwt.readToken(token));
    } catch (error) {
      logger.error(error);

      if (error instanceof jwt.TokenExpiredError) {
        reply.status(400).send({
          message: "Token expired",
          payload: null,
        });

        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        reply.status(400).send({
          message: "Malformed JWT",
          payload: null,
        });

        return;
      }

      reply.status(500).send({
        message: "Internal server error",
        payload: null,
      });
    }
  };
};
