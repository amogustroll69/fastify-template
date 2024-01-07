import argon2 from "argon2";
import config from "./config";

const salt = config.read().hashSalt;

const hash = (plain: string) => argon2.hash(plain + salt);
const verify = (hash: string, plain: string) =>
  argon2.verify(hash, plain + salt);

export { hash, verify };
export default { hash, verify };
