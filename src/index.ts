import "@babel/polyfill";
import { ApolloServer } from "@apollo/server";
import { AppResolvers, AppSchema } from "./graphql/_AppSchema";
import { startStandaloneServer } from "@apollo/server/standalone";
import { envconfig } from "./lib/envconfig";
import { createKnexConnectionsFromSetting } from "./server/createKnexConnection";
import { createAuthToken } from "./server/createAuthToken";

const server = new ApolloServer({
  typeDefs: AppSchema,
  resolvers: AppResolvers,
});

async function workplace() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(envconfig.port) },
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
        // auth: await createAuthToken(knex, req.),
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

workplace();
