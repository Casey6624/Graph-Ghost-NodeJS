const mongoose = require("mongoose");
const User = require("../../models/User");

module.exports = GraphQLResolvers = {
  // Get a list of all users
  users: () => {
    return [
      { _id: "123", email: "casey@test.com" },
      { _id: "456", email: "test@test.com" }
    ];
  },
  // Create user
  createUser: async ({ userInput }) => {
    const { email } = userInput;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("User already exists!");
    }

    const user = new User({
      email: email
    });
    return user
      .save()
      .then(() => {
        return user;
      })
      .catch(err => {
        throw err;
      });
  },
  createCode: args => {
    const { email } = args;
    const { generatedCode, retrievalCode } = args.codeInput;

    console.log(email);
    console.log(generatedCode, retrievalCode);

    return [
      {
        generatedCode: generatedCode,
        retrievalCode: retrievalCode,
        email: email
      }
    ];
  }
};
