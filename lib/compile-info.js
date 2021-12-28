const { getVarValue } = require("./utils")

function compileInfo(postmanJson, optsInfo) {
  const {
    info: { name, description: desc },
    variable = [],
  } = postmanJson
  const ver = getVarValue(variable, "version", "1.0.0")
  const { title = name, description = desc, version = ver, termsOfService, license, contact, xLogo } = optsInfo
  return {
    title,
    description,
    version,
    ...parseXLogo(variable, xLogo),
    ...(termsOfService ? { termsOfService } : {}),
    ...parseContact(variable, contact),
    ...parseLicense(variable, license),
  }
}

function parseXLogo(variables, xLogo = {}) {
  const urlVar = getVarValue(variables, "x-logo.urlVar")
  const backgroundColorVar = getVarValue(variables, "x-logo.backgroundColorVar")
  const altTextVar = getVarValue(variables, "x-logo.altTextVar")
  const hrefVar = getVarValue(variables, "x-logo.hrefVar")
  const { url = urlVar, backgroundColor = backgroundColorVar, altText = altTextVar, href = hrefVar } = xLogo
  return url != null ? { "x-logo": { url, backgroundColor, altText, href } } : {}
}

function parseLicense(variables, optsLicense = {}) {
  const nameVar = getVarValue(variables, "license.name")
  const urlVar = getVarValue(variables, "license.url")
  const { name = nameVar, url = urlVar } = optsLicense
  return name != null ? { license: { name, ...(url ? { url } : {}) } } : {}
}

function parseContact(variables, optsContact = {}) {
  const nameVar = getVarValue(variables, "contact.name")
  const urlVar = getVarValue(variables, "contact.url")
  const emailVar = getVarValue(variables, "contact.email")
  const { name = nameVar, url = urlVar, email = emailVar } = optsContact
  return [name, url, email].some(e => e != null)
    ? {
        contact: {
          ...(name ? { name } : {}),
          ...(url ? { url } : {}),
          ...(email ? { email } : {}),
        },
      }
    : {}
}

module.exports = { compileInfo }
