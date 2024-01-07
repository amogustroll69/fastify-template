import { readFileSync, writeFileSync, existsSync } from "fs";
import random from "./random";

interface Config {
  port: number;
  hashSalt: string;
  encSalt: string;
  jwtSecretKey: string;
  origin: string;
}

function read(): Config {
  if (!existsSync("config.json"))
    write({
      port: 8080,
      hashSalt: random.str(64),
      encSalt: random.str(64),
      jwtSecretKey: random.str(64),
      origin: "*",
    });

  return JSON.parse(readFileSync("config.json", { encoding: "utf-8" }));
}

function write(new_config: Config) {
  writeFileSync("config.json", JSON.stringify(new_config));
}

export default { read, write };
