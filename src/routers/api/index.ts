import { FastifyInstance } from "fastify";
import account from "./routers/account";
import auth from "./routers/auth";

export default {
  plugin: async (router: FastifyInstance) => {
    router.register(auth.plugin, auth.options);
    router.register(account.plugin, account.options);
  },

  options: {
    prefix: "/api",
  },
};
