import { FastifyRequest, FastifyReply } from "fastify";
import { hash } from "@/utils/argon2";
import validate from "@/utils/validate";
import random from "@/utils/random";
import jwt from "@/utils/jwt";
import db from "@/utils/db";
import logger from "@/utils/logger";

const req_schema = {
  username: {
    type: "string",
    minLength: 5,
    maxLength: 24,
  },

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

interface ReqBody {
  username: string;
  email: string;
  password: string;
}

export default async (
  req: FastifyRequest<{ Body: ReqBody }>,
  reply: FastifyReply,
) => {
  try {
    let validation = validate(
      {
        username: {
          type: "string",
        },

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
      username: req.body.username.trim(),
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
    });

    if (account) {
      reply.status(409).send({
        message: "Email already used",
        payload: null,
      });

      return;
    }

    const id = random.id("account", 32);

    await db.account.create({
      data: {
        id,
        username: body.username,
        email: body.email,
        password: await hash(body.password),
      },
    });

    reply.status(201).send({
      message: "Account created",
      payload: {
        username: req.body.username,
        email: req.body.email,
        token: await jwt.generateToken({ id, email: body.email }, "2d"),
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
