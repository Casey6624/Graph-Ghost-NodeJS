const axios = require("axios");
const mongoose = require("mongoose");
// Test code-submit, generating code from form endpoint

it("Should save user created endpoints to the database", async (done) => {
  const res = await axios.post("http://localhost:4500/code-submit", {
    emailAddress: "Jest@testing.com",
    data: [
      "Mountain",
      [
        {
          attributeName: "height",
          dataType: "Int",
          required: true,
        },
        {
          attributeName: "country",
          dataType: "string",
          required: true,
        },
      ],
    ],
    url: "www.mountains.org",
  });

  done();
});

it("Should save the crawl data to a database", async (done) => {
  const res = await axios.post("http://localhost:4500/crawl-me", {
    url: "www.mountains.org",
    entities: [
      {
        entityName: "Weather",
        xPathNodes: ['id("wob_pp")', 'id("wob_hm")', 'id("wob_ws")'],
        DOMDesc: [
          {
            type: "span",
            content: "0%",
            outerHTML: '<span id="wob_pp">0%</span>',
          },
          {
            type: "span",
            content: "79%",
            outerHTML: '<span id="wob_hm">79%</span>',
          },
          {
            type: "span",
            content: "13mph",
            outerHTML: '<span id="wob_ws">13mph</span>',
          },
        ],
      },
    ],
  });

  done();
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

afterEach(async () => {
  await removeAllCollections();
});
