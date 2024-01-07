import crypto from "crypto";

function str(length: number): string {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, length);
}

function id(prefix: string, length: number): string {
  return `${prefix}_${str(length)}`;
}

export default { id, str };
