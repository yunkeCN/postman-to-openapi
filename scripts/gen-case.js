const postmanToOpenApi = require("../lib/index")
const fsExtra = require("fs-extra")
const path = require("path")

const inputPath = path.resolve(process.cwd(), "test/resources/input/v2")
const outputPath = path.resolve(process.cwd(), "test/resources/output")

fsExtra.removeSync(outputPath)

const files = fsExtra.readdirSync(inputPath)

for (let i = 0; i < files.length; i++) {
  const inputContent = fsExtra.readFileSync(path.resolve(inputPath, files[i]))
  const result = postmanToOpenApi(JSON.parse(inputContent.toString()))
  const outputFileName = files[i].replace(/.json$/, ".yml")
  fsExtra.ensureFileSync(path.resolve(outputPath, outputFileName))
  fsExtra.writeFileSync(path.resolve(outputPath, outputFileName), result)
}
