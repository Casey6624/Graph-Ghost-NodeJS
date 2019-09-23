const { buildSchema } = require("graphql");

module.exports = UserSchema = buildSchema(`

type User {
    _id: ID!
    email: String!
}

type Code {
    _id: ID!
    generatedCode: String!
}

input UserInput {
    email: String!
}

input CodeInput {
    generatedCode: String!
}

type RootQuery{
    users: [User!]
    findCode(email: String!, retrievalCode: String!): [Code!]
}

type RootMutation{
    createUser(userInput: UserInput): User
    createCode(codeInput: CodeInput): Code
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
