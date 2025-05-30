import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface Book {
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

interface BookArgs {
  input: {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
  }
}

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  savedBooks: Book[];
}

interface LoginArgs {
  name: string;
  email: string;
  password: string;
}

interface Auth {
  token: string;
  user: User;
}

interface AddUserArgs {
  input:{
    name: string;
    email: string;
    password: string;
  }
}

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs): Promise<Auth> => {
      const user = await User.create(input) as User || null; 
      const token = signToken(user.name, user.email, user._id); 
      return { token, user };
    },
    login: async (_parent: any, { email, password }: LoginArgs): Promise<Auth> => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const correctPw = await user.isCorrectPassword(password); 

      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user.name, user.email, user._id);

      return { token, user };
    },
    saveBook: async (_parent: any, { input }: BookArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: {...input} }
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError(`Invalid book credentials`);
    },
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: Context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError(`Invalid book credentials`);
    },
    }
  };

export default resolvers;
