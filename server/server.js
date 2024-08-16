const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Create an Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  introspection: true, // Explicitly enable introspection
});

// Start Apollo Server and apply middleware
const startApolloServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    // Serve static files with cache control for production environment
    if (process.env.NODE_ENV === "production") {
      // Serve static files from the client build directory with cache control
      app.use(express.static(path.join(__dirname, "../client/dist"), {
        maxAge: '1d', // Cache for 1 day
      }));

      // Serve the main HTML file for all non-file routes (SPA fallback)
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    } else {
      // Development environment fallback
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    // Start the database and server
    db.once("open", () => {
      app.listen(PORT, () => {
        console.log(`API server running at http://localhost:${PORT} !`);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
};

// Start the Apollo server
startApolloServer();