// Models
const Code = require("../models/Code");
const User = require("../models/User");
const Crawl = require("../models/Crawl");
// Mail functionality
const Mail = require("../mail/index");
// helpers
const Helpers = require("../helpers/helpers.js");

exports.submitCode = async (req, res, next) => {
  const { emailAddress, data, url } = req.body;

  console.log(req.body);

  if (!emailAddress || !data) {
    res.status(400);
    res.send("Please supply a valid email address and stringified code.");
    return;
  }

  if (emailAddress === "" || !Helpers.validateEmail(emailAddress)) {
    res.status(400);
    res.send("Email Address is invalid");
    return;
  }

  if (url) {
    if (!Helpers.validateUrl(url)) {
      res.status(400);
      res.send("URL is invalid");
      return;
    }
  }

  let userID;
  // check to see if a user is in the system
  const existingUser = await User.findOne({ email: emailAddress });

  // set existing userID if user is found
  if (existingUser) {
    userID = existingUser._id;
  }
  // create new user if no existing user is found
  if (!existingUser) {
    const user = new User({
      email: emailAddress,
    });
    const usrRes = await user.save();
    userID = usrRes._id;
  }
  // Generate an 8 string random lowercase retreival code
  // Got from Stackoverflow, don't trust!
  function createRetreivalCode(length = 8) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  let newRetrievalCode = createRetreivalCode();

  const code = new Code({
    generatedCode: data,
    retrievalCode: newRetrievalCode,
    creator: userID,
    url: url,
  });

  Mail.sendNow(emailAddress, newRetrievalCode, code._id, userID);

  const codeRes = await code.save();
  const { _id: codeId } = codeRes;
  // TODO: Remove hard coded user!! Needs to do a search first to find the UserId via an email address
  return res.json({ codeId: codeId, creatorId: userID });
};

exports.crawlMe = async (req, res, next) => {
  const { entities, url } = req.body;
  console.log(entities);
  console.log(url);
  if (!entities) {
    // Unprocessable Entity
    res.status(422);
    res.send("No entities have been posted to the server.");
  }

  const crawl = new Crawl({
    rawAttributes: entities,
    url: url,
  });
  const crawlRes = await crawl.save();
  if (!crawlRes) {
    res.status(500);
    res.send("Internal Server Error. Please try again later");
  }
  res.status(200);
  res.send(JSON.stringify({ url: crawlRes._id }));
};
