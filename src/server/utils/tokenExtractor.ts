import { IncomingMessage } from "http";
import url from "url";

export type TokenHandler = (req) => string;

export default function tokenExtractor(req: IncomingMessage): string {
  let token = undefined;

  if (req) {
    const query = url.parse(req.url, true).query;

    if (query && query.token) {
      token = query.token;
    } else if (req.headers && req.headers.authorization) {
      // Get the token after the BEARER part
      const tmp = req.headers.authorization.split(" ");
      if (tmp.length === 2 && tmp[0] === "Bearer") {
        token = tmp[1];
      }
    }
  }

  return token;
}
