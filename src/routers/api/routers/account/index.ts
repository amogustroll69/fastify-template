import { FastifyInstance } from "fastify";
import indexGET from "./routes/index/GET";
import indexPATCH from "./routes/index/PATCH";
import authorization from "../../../../middleware/authorization";

export default {
  plugin: async (router: FastifyInstance) => {
    router.get("/", authorization(indexGET));
    router.patch("/", authorization(indexPATCH));
  },

  options: {
    prefix: "/account",
  },
};
