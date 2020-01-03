const { buildSchema } = require("graphql");

module.exports = UserSchema = buildSchema(`

type User {
    _id: ID!
    email: String!
}

type Code {
    _id: ID!
    generatedCode: String!
    retrievalCode: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
}

input UserInput {
    email: String!
}

input CodeInput {
    generatedCode: String
    retrievalCode: String
}

type CodeIDAndUserID {
    codeID: String
    userID: String
}

type RootQuery{
    users: [User!]
    findCode(email: String!, retrievalCode: String!): CodeIDAndUserID
    findCodeRedirect(creatorId: String!, codeId: String!): Code!
}

type RootMutation{
    createUser(userInput: UserInput): User
    createCode(codeInput: CodeInput, email: String): Code!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
