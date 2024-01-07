import { FastifyRequest, FastifyReply } from "fastify";
import { TokenPayload } from "@/utils/jwt";
import { hash, verify } from "@/utils/argon2";
import validate from "@/utils/validate";
import db from "@/utils/db";

const req_schema = {
  username: {
    type: "string",
    minLength: 5,
    maxLength: 24,
    optional: true,
  },

  email: {
    type: "string",
    maxLength: 24,
    email: true,
    optional: true,
  },

  password: {
    type: "string",
    minLength: 12,
    maxLength: 32,
    password: true,
    optional: true,
  },

  currentPassword: {
    type: "string",
    minLength: 12,
    maxLength: 32,
    password: true,
    optional: true,
  },
};

interface NewAccountData {
  username?: string;
  email?: string;
  password?: string;
}

export default async (
  req: FastifyRequest<{
    Body: {
      username: string;
      email: string;
      password: string;
      currentPassword: string;
    };
  }>,
  reply: FastifyReply,
  token: TokenPayload,
) => {
  const account = await db.account.findUnique({
    where: {
      id: token.id,
    },
  });

  if (!account) {
    reply.status(404).send({
      message: "Account not found",
      payload: null,
    });

    return;
  }

  const validation = validate(req_schema, req.body);

  if (!validation.success) {
    reply.status(400).send({ message: validation.errorMsg, payload: null });
    return;
  }

  const newData: NewAccountData = {};

  if (req.body.username) newData.username = req.body.username;
  if (req.body.email) newData.email = req.body.email;
  if (req.body.password && req.body.currentPassword) {
    if (!(await verify(account.password, req.body.currentPassword))) {
      reply
        .status(400)
        .send({ message: "Incorrect current password", payload: null });
      return;
    }

    newData.password = await hash(req.body.password);
  }

  try {
    const newAcc = await db.account.update({
      where: {
        id: account.id,
      },

      select: {
        username: true,
        email: true,
        vaultItems: true,
      },

      data: newData,
    });

    let vaultItems = 0;
    let passwords = 0;

    newAcc.vaultItems.forEach((item) => {
      if (item.isPassword) passwords++;
      else vaultItems++;
    });

    reply.send({
      message: "Success",
      payload: {
        username: newAcc.username,
        email: newAcc.email,
        vaultItems,
        passwords,
      },
    });
  } catch {
    reply.status(500).send({
      message: "Internal server error",
      payload: null,
    });
  }
};
