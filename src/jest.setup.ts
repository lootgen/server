import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { registerAllEntities } from './entity';
import { ALL_RESOLVERS } from './resolvers';

beforeAll(async () => {
  global.connection = await createConnection('test');
  registerAllEntities(global.connection);

  const schema = await buildSchema({
    resolvers: ALL_RESOLVERS,
  });
  const server = new ApolloServer({ schema });
  global.client = createTestClient(server);
});

beforeEach(async () => {
  await global.connection.synchronize(true);
});
