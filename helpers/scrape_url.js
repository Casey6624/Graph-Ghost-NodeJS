const axios = require("axios")

async function getRawHTML() {
    const res = await axios.get("http://localhost/ggd/index.html")
    console.log(res.data)
}

module.exports = {
    getRawHTML: getRawHTML()
}