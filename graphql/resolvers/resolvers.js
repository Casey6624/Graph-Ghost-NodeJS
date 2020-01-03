const mongoose = require("mongoose");
const User = require("../../models/User");
const Code = require("../../models/Code");

module.exports = GraphQLResolvers = {
  // Get a list of all users
  users: () => {
    return [
      { _id: "123", email: "casey@test.com" },
      { _id: "456", email: "test@test.com" }
    ];
  },
  // Create a user
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
  // Create a new block of API code
  createCode: async args => {
    const { email } = args;
    const { generatedCode, retrievalCode } = args.codeInput;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      throw new Error("User does not exist!");
    }

    const code = new Code({
      generatedCode: generatedCode,
      retrievalCode: retrievalCode,
      creator: existingUser
    });

    const result = await code.save();

    return result;
  },
  // Find a code by email/retrevial code
  findCode: async ({ email, retrievalCode }) => {
    const code = await Code.findOne({ retrievalCode: retrievalCode });
    if (!code) {
      throw new Error(
        "There was an issue with that retrieval code, please double check the code is correct"
      );
    }
    const { creator: userID, _id: codeID } = code;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("We were unable to find an associated user account");
    }
    return { codeID, userID };
  },
  // Used only on the redirect of /Create to /Code within create.js of Gatsby frontend
  findCodeRedirect: async ({ creatorId, codeId }) => {
    console.log("Find code has been triggered");
    if (!creatorId) {
      throw new Error("No Creator ID attached to the request!");
    }
    if (!codeId) {
      throw new Error("No Code ID attached to the request!");
    }

    const code = await Code.findOne({ _id: codeId, creator: creatorId });
    if (!code) {
      return new Error("Could not find that codeId & creatorId match!");
    }

    code.generatedCode = JSON.stringify(code.generatedCode);

    return code;
  }
};
