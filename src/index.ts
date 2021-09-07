import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import * as PostgresConnectionStringParser from 'pg-connection-string';
import { env } from 'process';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { registerAllEntities } from './entity';
import { ALL_RESOLVERS } from './resolvers';

// Set up the DB connection and Apollo server
(async (): Promise<void> => {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const connectionOptions =
        PostgresConnectionStringParser.parse(databaseUrl);
      const postgresConnectionOptions: PostgresConnectionOptions = {
        type: 'postgres',
        name: 'production',
        host: connectionOptions.host ?? undefined,
        port: connectionOptions.port
          ? Number.parseInt(connectionOptions.port)
          : undefined,
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database ?? undefined,
        synchronize: false,
        logging: false,
        entities: ['src/entity/**/*.ts', 'entity/**/*.js'],
        migrations: ['src/migration/**/*.ts', 'migration/**/*.js'],
        ssl: { rejectUnauthorized: false },
      };
      global.connection = await createConnection(postgresConnectionOptions);
    } else {
      const connectionName = env.DB_CONNECTION_NAME ?? 'default';
      global.connection = await createConnection(connectionName);
    }

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
