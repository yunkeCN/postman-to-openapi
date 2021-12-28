const postmanToOpenApi = require("../lib/index")
const fsExtra = require("fs-extra")
const path = require("path")

const inputPath = path.resolve(process.cwd(), "test/resources/input")
const outputPath = path.resolve(process.cwd(), "test/resources/output")

const files = [
  {
    inputFile: "v2/PostmantoOpenAPI.json",
    outputFile: "Basic.yml",
  },
  {
    inputFile: "v2/PostmantoOpenAPI.json",
    outputFile: "BasicWithAuth.yml",
  },
  {
    inputFile: "v2/PostmantoOpenAPI.json",
    outputFile: "LicenseContactPartial.yml",
  },
  {
    inputFile: "v2/PostmantoOpenAPI.json",
    outputFile: "LicenseContactPartial2.yml",
  },
  {
    inputFile: "v2/PostmantoOpenAPI.json",
    outputFile: "ExternalDocsOptsPartial.yml",
  },
  {
    inputFile: "v2/SimplePost.json",
    outputFile: "InfoOpts.yml",
  },
  {
    inputFile: "v2/SimplePost.json",
    outputFile: "CustomTag.yml",
  },
  {
    inputFile: "v2/FolderCollection.json",
    outputFile: "Folders.yml",
  },
  {
    inputFile: "v2/FolderCollection.json",
    outputFile: "FoldersNoConcat.yml",
  },
  {
    inputFile: "v2/FolderCollection.json",
    outputFile: "FoldersSeparator.yml",
  },
  {
    inputFile: "v2/MultipleServers.json",
    outputFile: "ServersOpts.yml",
  },
  {
    inputFile: "v2/MultipleServers.json",
    outputFile: "NoServers.yml",
  },
  {
    inputFile: "v2/LicenseContact.json",
    outputFile: "LicenseContactOpts.yml",
  },
  {
    inputFile: "v2/ParseStatusCode.json",
    outputFile: "ParseStatus.yml",
  },
  {
    inputFile: "v2/ExternalDocs.json",
    outputFile: "ExternalDocsOpts.yml",
  },
  {
    inputFile: "v2/XLogo.json",
    outputFile: "XLogoVar.yml",
  },
  {
    inputFile: "v2/AuthMultiple.json",
    outputFile: "AuthOptions.yml",
  },
  {
    inputFile: "v2/Responses.json",
    outputFile: "ResponsesNoHeaders.yml",
  },
  {
    inputFile: "v2/Variables.json",
    outputFile: "VariablesAdditional.yml",
  },
  {
    inputFile: "v2/Variables.json",
    outputFile: "VariablesAdditional.yml",
  },
  {
    inputFile: "NullHeaders.json",
    outputFile: "NullHeader.yml",
  },
  {
    inputFile: "NoOptionsInBody.json",
    outputFile: "NoOptionsInBody.yml",
  },
]

for (let i = 0; i < files.length; i++) {
  const inputContent = fsExtra.readFileSync(path.resolve(inputPath, files[i].inputFile))
  const result = postmanToOpenApi(JSON.parse(inputContent.toString()))
  fsExtra.ensureFileSync(path.resolve(outputPath, files[i].outputFile))
  fsExtra.writeFileSync(path.resolve(outputPath, files[i].outputFile), result)
}
