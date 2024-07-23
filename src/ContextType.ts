import { Knex } from "knex";
import http from "http";
import { Graph } from "./generated/graph";

export type KnexList = {
  default: Knex;
};

export type ContextType = {
  knex: KnexList;
  auth?: Graph.User;
};
