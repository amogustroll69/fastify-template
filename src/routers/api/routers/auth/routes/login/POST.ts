import { FastifyRequest, FastifyReply } from "fastify";
import { verify } from "@/utils/argon2";
import validate from "@/utils/validate";
import jwt from "@/utils/jwt";
import db from "@/utils/db";
import logger from "@/utils/logger";

const req_schema = {
  email: {
    type: "string",
    minLength: 5,
    maxLength: 320,
    email: true,
  },

  password: {
    type: "string",
    minLength: 12,
    maxLength: 32,
    password: true,
  },
};

type ReqBody = {
  email: string;
  password: string;
};

export default async (
  req: FastifyRequest<{ Body: ReqBody }>,
  reply: FastifyReply,
) => {
  try {
    let validation = validate(
      {
        email: {
          type: "string",
        },

        password: {
          type: "string",
        },
      },
      req.body,
    );
    if (!validation.success) {
      reply.status(400).send({ message: validation.errorMsg, payload: null });
      return;
    }
    const body: ReqBody = {
      email: req.body.email.trim(),
      password: req.body.password.trim(),
    };

    if (req.headers["content-type"] !== "application/json") {
      reply.status(400).send({
        message: "Expected JSON",
        payload: null,
      });

      return;
    }

    validation = validate(req_schema, body);

    if (!validation.success) {
      reply.status(400).send({ message: validation.errorMsg, payload: null });
      return;
    }

    const account = await db.account.findUnique({
      where: {
        email: body.email,
      },

      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!account) {
      reply.status(404).send({
        message: "Email not found",
        payload: null,
      });

      return;
    }

    if (!(await verify(account.password, req.body.password))) {
      reply.status(401).send({
        message: "Invalid credentials",
        payload: null,
      });

      return;
    }

    reply.send({
      message: "Success",
      payload: {
        username: account.username,
        email: account.email,
        token: await jwt.generateToken(
          { id: account.id, email: account.email },
          "2d",
        ),
      },
    });
  } catch (error: unknown) {
    reply.status(500).send({
      message: "Internal server error",
      payload: null,
    });

    if (error instanceof Error) logger.error(error.message);
  }
};
