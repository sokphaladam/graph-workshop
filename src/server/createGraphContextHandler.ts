import { Knex } from "knex";
import { ContextFunction } from "@apollo/server";
import express from "express";
import { ContextType, KnexList } from "src/ContextType";
import { TokenHandler } from "./utils/tokenExtractor";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { createAuthToken } from "./createAuthToken";

export function createGraphContextHandler(
  knexPools: KnexList,
  tokenHandler: TokenHandler
): ContextFunction<[ExpressContextFunctionArgument], ContextType> {
  return async function graphContextHandler({ req }): Promise<ContextType> {
    const tx = knexPools.default;

    // Get the token
    const token = tokenHandler(req);
    const auth = token ? await createAuthToken(tx, token) : null;

    return {
      auth,
      knex: knexPools,
      header: req ? req.headers : {},
    };
  };
}
