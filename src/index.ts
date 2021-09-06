import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import { env } from 'process';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { registerAllEntities } from './entity';
import { ALL_RESOLVERS } from './resolvers';

// Set up the DB connection and Apollo server
(async (): Promise<void> => {
  try {
    const connectionName = env.DB_CONNECTION_NAME ?? 'default';
    global.connection = await createConnection(connectionName);
    registerAllEntities(global.connection);

    const schema = await buildSchema({
      resolvers: ALL_RESOLVERS,
    });

    const server = new ApolloServer({ schema });

    const PORT = process.env.PORT || 4000;
    const { url } = await server.listen({ port: PORT });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error(error);
  }
})();
