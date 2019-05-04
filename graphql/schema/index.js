// Later, Will be changed to GraphQLSchema, due to the reasons in the page below
// https://stackoverflow.com/questions/53984094/notable-differences-between-buildschema-and-graphqlschema

const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    _id: ID!
    name: String!
    email: String!
}

type UserToken {
    _id: ID!
    name: String!
    email: String!
    token: String!
    expires: Float!
}

input userInput {
    name: String!
    email: String!
    password: String!
}

type Query {
    user(userId: String!): User!
    login(email: String!, password: String!): UserToken!
}

type Mutation {
    createUser(user: userInput!): User!
}
`);