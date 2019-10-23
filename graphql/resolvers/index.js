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
    const associatedCode = await Code.findOne({ retrievalCode: retrievalCode });

    console.log(associatedCode);
    if (!associatedCode) {
      throw new Error(`Retrieval Code: ${retrievalCode} does not exist :(`);
    }

    const { creator } = associatedCode;
    const associatedUser = await User.findOne({ _id: creator });

    const { email: associatedEmail } = associatedUser;

    if (associatedEmail.trim() !== email.trim()) {
      throw new Error(
        `Retrieval Code <${retrievalCode}> does not belong to your account.`
      );
    }
    return associatedCode;
  },
  findCodeRedirect: async ({ creatorId, codeId }) => {
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

    return code;
  }
};
