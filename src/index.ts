import fastify from "fastify";
import cors from "@fastify/cors";
import logger from "./utils/logger";
import handlers from "./handlers";
import random from "./utils/random";
import config from "./utils/config";
import routers from "./routers";

const configData = config.read();

const server = fastify({
  trustProxy: true,
  logger: logger.config,
  genReqId: () => random.id("req", 16),
});

server.register(cors, { origin: configData.origin });
server.register(routers.api.plugin, routers.api.options);
server.register(routers.frontend.plugin, routers.frontend.options);

server.setNotFoundHandler(handlers.notFound);

const shutdown = async () => {
  await server.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.listen({ port: configData.port, host: "0.0.0.0" });
