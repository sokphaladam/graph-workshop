import "@babel/polyfill";
import { ApolloServer } from "@apollo/server";
import { AppResolvers, AppSchema } from "./graphql/_AppSchema";
import { startStandaloneServer } from "@apollo/server/standalone";
import { envconfig } from "./lib/envconfig";

const server = new ApolloServer({
  typeDefs: AppSchema,
  resolvers: AppResolvers,
});

async function workplace() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(envconfig.port) },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

workplace();
