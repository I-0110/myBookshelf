const typeDefs = `
  
  type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type BookInput {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String!
  }

  type User {
    _id: ID
    name: String
    email: String
    savedBooks: [Book]
    bookCount: Int
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {
    me: User
  }

  type Mutation {
    login( email: String!, password: String! ): Auth
    addUser( name: String!, email:String!, password: String! ): Auth
    saveBook( input: BookInput! ): User
    removeBook ( bookId: String! ): User
  }
`;

export default typeDefs;
