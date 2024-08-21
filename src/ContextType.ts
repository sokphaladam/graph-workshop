import { Knex } from "knex";
import http from "http";
import { Graph } from "./generated/graph";
import { PubSub } from "graphql-subscriptions";

export type KnexList = {
  default: Knex;
};

export type ContextType = {
  knex: KnexList;
  pubsub: PubSub;
  auth?: Graph.User;
};
