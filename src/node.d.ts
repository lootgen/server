/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloServerTestClient } from 'apollo-server-testing';
import { Connection } from 'typeorm';
/* eslint-enable */

declare global {
  namespace NodeJS {
    interface Global {
      connection: Connection;
      client: ApolloServerTestClient;
    }
  }
}
