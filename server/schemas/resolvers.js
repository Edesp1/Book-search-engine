const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userInfo = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userInfo;
      }

      throw new AuthenticationError('Not authenticated');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const passwordMatch = await user.passwordMatches(password);
      if (!passwordMatch) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { bookInfo }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookInfo } },
          { new: true, runValidators: true }
        );
        return user;
      }

      throw new AuthenticationError('You need to be logged in');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in');
    },
  },
};

module.exports = resolvers;