// Models
const Code = require("../models/Code");
const User = require("../models/User");

exports.submitCode = async (req, res, next) => {
  // TODO: create retrievalCode automagically and create Creator before creating the code
  const { emailAddress, data } = req.body;

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
      email: emailAddress
    });
    const usrRes = await user.save();
    userID = usrRes._id;
  }

  const code = new Code({
    generatedCode: data,
    retrievalCode: "123",
    creator: userID
  });
  const codeRes = await code.save();
  const { _id: codeId } = codeRes;
  // TODO: Remove hard coded user!! Needs to do a search first to find the UserId via an email address
  return res.json({ codeId: codeId, creatorId: userID });
};
