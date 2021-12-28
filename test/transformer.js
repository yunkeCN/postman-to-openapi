const postmanToOpenApi = require("../lib")
const fsExtra = require("fs-extra")
const path = require("path")

function pto(input, output, options, isGenerate) {
  const inputFile = fsExtra.readFileSync(path.resolve(process.cwd(), input))

  const result = postmanToOpenApi(JSON.parse(inputFile.toString()), options)

  if (output) {
    fsExtra.ensureFileSync(path.resolve(process.cwd(), output))
    fsExtra.writeFileSync(path.resolve(process.cwd(), output), result)
  }

  return result
}
pto.version = postmanToOpenApi.version

module.exports = { postmanToOpenApi: pto }
