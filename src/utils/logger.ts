import fastify, { FastifyRequest } from "fastify";

const config = {
  level: "info",
  redact: ["headers.authorization"],
  serializers: {
    req(request: FastifyRequest) {
      return {
        method: request.method,
        url: request.url,
        hostname: request.hostname,
        remoteAddress: request.ip,
        remotePort: request.socket.remotePort,
      };
    },
  },
};

const logger = fastify({ logger: config }).log;

const info = logger.info;
const warn = logger.warn;
const error = logger.error;

export { config, info, warn, error };
export default { config, info, warn, error };
