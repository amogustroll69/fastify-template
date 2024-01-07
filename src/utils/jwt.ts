import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import config from "./config";

const config_data = config.read();

interface TokenPayload {
  id: string;
  email: string;
}

const generateToken = (payload: TokenPayload, expiresIn: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config_data.jwtSecretKey,
      { expiresIn: expiresIn },
      (error, token) => {
        if (error) reject(error);

        resolve(token);
      },
    );
  });
};

const readToken = (token: string) => {
  const payload = jwt.verify(token, config_data.jwtSecretKey);

  if (typeof payload === "string") throw new JsonWebTokenError("");

  return payload as TokenPayload;
};

export {
  generateToken,
  readToken,
  JsonWebTokenError,
  TokenExpiredError,
  TokenPayload,
};
export default {
  generateToken,
  readToken,
  JsonWebTokenError,
  TokenExpiredError,
};
