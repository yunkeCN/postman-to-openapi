/* Calculate the global auth based on options and postman definition */
function parseAuth({ auth }, optAuth, securitySchemes) {
  if (optAuth != null) {
    return parseOptsAuth(optAuth)
  }
  return parsePostmanAuth(auth, securitySchemes)
}

/* Parse a postman auth definition */
function parsePostmanAuth(postmanAuth = {}, securitySchemes) {
  const { type } = postmanAuth
  if (type != null) {
    securitySchemes[`${type}Auth`] = {
      type: "http",
      scheme: type,
    }
    return {
      components: { securitySchemes },
      security: [
        {
          [`${type}Auth`]: [],
        },
      ],
    }
  }
  return Object.keys(securitySchemes).length === 0 ? {} : { components: { securitySchemes } }
}

/* Parse a options global auth */
function parseOptsAuth(optAuth) {
  const securitySchemes = {}
  const security = []
  for (const [secName, secDefinition] of Object.entries(optAuth)) {
    const { type, scheme, ...rest } = secDefinition
    if (type === "http" && ["bearer", "basic"].includes(scheme)) {
      securitySchemes[secName] = {
        type: "http",
        scheme,
        ...rest,
      }
      security.push({ [secName]: [] })
    }
  }
  return Object.keys(securitySchemes).length === 0
    ? {}
    : {
        components: { securitySchemes },
        security,
      }
}

module.exports = { parseAuth }
