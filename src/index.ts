import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import * as PostgresConnectionStringParser from 'pg-connection-string';
import { env } from 'process';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { registerAllEntities } from './entity';
import { ALL_RESOLVERS } from './resolvers';
import registerExpressAPI from './api';

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
    await server.start();

    const app = express();
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'https://www.lootgen.party');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      );
      next();
    });

    registerExpressAPI(app);

    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    const appServer = app.listen({ port: PORT });
    console.log(
      `🚀 GraphQL API ready at http://localhost:${appServer.address().port}${
        server.graphqlPath
      }`
    );
    console.log(
      `💥 REST API ready at http://localhost:${appServer.address().port}/`
    );
  } catch (error) {
    console.error(error);
  }
})();
