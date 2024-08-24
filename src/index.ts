import "@babel/polyfill";
import { ApolloServer } from "@apollo/server";
import { AppResolvers, AppSchema } from "./graphql/_AppSchema";
import { envconfig } from "./lib/envconfig";
import { createKnexConnectionsFromSetting } from "./server/createKnexConnection";
import { createAuthToken } from "./server/createAuthToken";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

const app = express();

const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
  typeDefs: AppSchema,
  resolvers: AppResolvers,
});

const weServer = new WebSocketServer({
  server: httpServer,
});

const serverCleanup = useServer(
  {
    schema,
    onConnect: async (ctx) => {
      if (!ctx.connectionParams) {
        throw new Error("Auth token missing!");
      }
    },
    onDisconnect(ctx, code, reason) {
      // console.log("Disconnected!");
    },
  },
  weServer
);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

async function workplace() {
  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const knex = createKnexConnectionsFromSetting();

        if (req.headers.authorization) {
          return {
            knex,
            auth: await createAuthToken(
              knex.default,
              req.headers.authorization.replace("Bearer", "").trim()
            ),
          };
        }

        if ((req as any).query.token) {
          return {
            knex,
            auth: await createAuthToken(
              knex.default,
              (req as any).query.token.trim()
            ),
          };
        }

        return {
          knex,
          auth: null,
        };
      },
    })
  );

  const PORT = Number(envconfig.port) || 4000;

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
}

workplace();
