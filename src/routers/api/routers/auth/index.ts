import { FastifyInstance } from "fastify";
import register from "./routes/register/POST";
import login from "./routes/login/POST";

export default {
  plugin: async (router: FastifyInstance) => {
    router.post("/register", register);
    router.post("/login", login);
  },

  options: {
    prefix: "/auth",
  },
};
