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
import { json } from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";

async function workplace() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs: AppSchema,
    resolvers: AppResolvers,
  });

  const wsServer = new WebSocketServer({
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
        console.log("Disconnected!");
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    allowBatchedHttpRequests: true,
    csrfPrevention: false,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              wsServer.close();
              // await serverCleanup.dispose();
            },
          };
        },
      },
    ].filter(Boolean),
  });

  await server.start();
  console.log("Apollo Server is started");
  app.use(cors());

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    json(),
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

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

workplace();
