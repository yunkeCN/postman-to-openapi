const postmanToOpenApi = require("../lib")
const fsExtra = require("fs-extra")

function pto(file) {
  const result = fsExtra.readFileSync(file)
  return postmanToOpenApi(JSON.parse(result.toString()))
}

module.exports = { postmanToOpenApi: pto }
