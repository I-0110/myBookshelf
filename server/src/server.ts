import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import { fileURLToPath } from 'url';

// set import.meta.url to use __dirname and be able to use it with es modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// setting apollo server
const server = new ApolloServer({ typeDefs, resolvers })

// start apollo server
const startApolloServer = async () => {
    await server.start()
    await db()
    const app = express();
    const PORT = process.env.PORT || 3001

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use('/graphql', expressMiddleware(server, { context: authenticateToken as any }))

    if (process.env.NODE_ENV === 'production') {
      console.log(__dirname)
      app.use(express.static(path.join(__dirname, '../../client/dist')))

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join( __dirname, '../../client/dist/index.html'))
    });
  }

  app.listen( PORT, () => {
    console.log(`🌍 Server is running on port ${PORT}.`)
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
  })
}

// return start, so it starts!
startApolloServer()
