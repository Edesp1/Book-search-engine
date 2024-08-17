const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Set up Apollo Server middleware
  app.use('/graphql', expressMiddleware(server, {
    context: ({ req }) => authMiddleware({ req }),
  }));

  // Serve static assets and handle routing based on environment
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Serve index.html from 'dist' as the fallback route
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } else {
    app.use(express.static(path.join(__dirname, '../client')));

    // Serve index.html from 'client' for all routes in development
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();