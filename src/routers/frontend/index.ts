import { FastifyInstance } from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";

export default {
  plugin: async (router: FastifyInstance) => {
    router.register(fastifyStatic, { prefix: "/", root: path.join(__dirname, "files") });
  },
  options: {},
};
