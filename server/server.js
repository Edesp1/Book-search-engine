const express = require('express');
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require("./schemas");
const path = require('path');
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

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware,
  }));

  // If in production, serve static files from the client/dist directory
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Serve the index.html file for any other routes in production
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } else {
    // In development, provide a fallback for the root URL
    app.get('/', (req, res) => {
      res.send('API is running. Switch to production mode to serve the React app.');
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();