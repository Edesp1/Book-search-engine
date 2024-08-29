const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthErr: new GraphQLError("User not authenticated", {
    extensions: {
      code: "unauthenticated",
    },
  }),

  // Middleware function for authenticated routes
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization || req.body.token;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim(); // Extract token from Bearer scheme
    }

    if (!token) {
      return {}; // Return an empty context object if no token is provided
    }

    try {
      // Verify token and get user data out of it
      const { data } = jwt.verify(token, secret); // Use `expiresIn` in sign
      return { user: data }; // Return user data in context
    } catch (err) {
      console.log('Invalid token', err);
      return {}; // Return an empty context object if token is invalid
    }
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};