import { FastifyRequest, FastifyReply } from "fastify";

function notFound(req: FastifyRequest, reply: FastifyReply) {
  reply.status(404).send({
    message: `${req.method} ${req.url} not found`,
    payload: null,
  });
}

export { notFound };
export default { notFound };
