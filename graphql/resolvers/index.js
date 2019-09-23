const mongoose = require("mongoose");
const User = require("../../models/User");

module.exports = GraphQLResolvers = {
  // Get a list of all users
  users: () => {
    return [
      { _id: "123", email: "casey@test.com" },
      { _id: "456", email: "test@test.com" }
    ];
  }
};
