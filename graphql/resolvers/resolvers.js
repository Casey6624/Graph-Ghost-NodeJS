// Libraries
const mongoose = require("mongoose");
// Models
const User = require("../../models/User");
const Code = require("../../models/Code");
const Crawl = require("../../models/Crawl");
// Mail Functionality
const Mail = require("../../mail/index");

module.exports = GraphQLResolvers = {
  // Create a user
  createUser: async ({ userInput }) => {
    const { email } = userInput;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("User already exists!");
    }

    const user = new User({
      email: email,
    });
    return user
      .save()
      .then(() => {
        return user;
      })
      .catch((err) => {
        throw err;
      });
  },
  // Create a new block of API code
  createCode: async (args) => {
    const { email } = args;
    const { generatedCode, retrievalCode } = args.codeInput;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      throw new Error("User does not exist!");
    }

    const code = new Code({
      generatedCode: generatedCode,
      retrievalCode: retrievalCode,
      creator: existingUser,
    });

    Mail.sendNow(email, retrievalCode, code._id, existingUser._id);

    const result = await code.save();

    return result;
  },
  // Find a code by email/retrevial code
  findCode: async ({ email, retrievalCode }) => {
    console.log(email);
    const code = await Code.findOne({ retrievalCode: retrievalCode });
    if (!code) {
      throw new Error(
        "There was an issue with that retrieval code, please double check the code is correct"
      );
    }
    const { creator: userID, _id: codeID } = code;
    const user = await User.findOne({ email: email })
      .then(() => {
        return { codeID, userID };
      })
      .catch((err) => {
        console.log(err);
        throw new Error(
          "Cannot find that combination! Please double check your retrieval code is correct."
        );
      });
    return { codeID, userID };
  },
  // Used only on the redirect of /Create to /Code within create.js of Gatsby frontend
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
    code.generatedCode = JSON.stringify(code.generatedCode);

    return code;
  },
  findRawCrawl: async ({ crawlId }) => {
    if (!crawlId) {
      throw new Error("New crawlID has been supplied.");
    }
    const crawl = await Crawl.findById(crawlId);
    console.log(crawl);
    if (!crawl) {
      throw new Error("Could not find a crawl record for ID" + crawlId);
    }
    // We need to turn rawAttrib into a string so it can be type checked by GraphQL. Currently an object in MongoDB
    crawl.rawAttributes = JSON.stringify(crawl.rawAttributes);
    return crawl;
  },
};
