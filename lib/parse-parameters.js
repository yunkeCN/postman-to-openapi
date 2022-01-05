const { inferType } = require("./utils")
/* Parse the Postman query and header and transform into OpenApi parameters */
function parseParameters(query, header, paths, paramsMeta = {}, pathVars) {
  // parse Headers
  let parameters = header.reduce(mapParameters("header"), [])
  // parse Query
  parameters = query.reduce(mapParameters("query"), parameters)
  // Path params
  parameters.push(...extractPathParameters(paths, paramsMeta, pathVars))
  return parameters.length ? { parameters } : {}
}

/* Accumulator function for different types of parameters */
function mapParameters(type) {
  return (parameters, { key, description, value, disabled }) => {
    if (disabled) {
      return parameters
    }
    const required = /\[required\]/gi.test(description)
    parameters.push({
      name: key,
      in: type,
      schema: { type: inferType(value) },
      ...(required ? { required } : {}),
      ...(description ? { description: description.replace(/ ?\[required\] ?/gi, "") } : {}),
      ...(value ? { example: value } : {}),
    })
    return parameters
  }
}

function extractPathParameters(path, paramsMeta, pathVars) {
  const matched = path.match(/{\s*[\w-]+\s*}/g) || []
  return matched.map(match => {
    const name = match.slice(1, -1)
    const { type: varType = "string", description: desc, value } = pathVars[name] || {}
    const { type = varType, description = desc, example = value } = paramsMeta[name] || {}
    return {
      name,
      in: "path",
      schema: { type },
      required: true,
      ...(description ? { description } : {}),
      ...(example ? { example } : {}),
    }
  })
}

module.exports = { parseParameters }
