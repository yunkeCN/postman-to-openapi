/* calculate the type of a variable based on OPenApi types */
function inferType(value) {
  if (/^\d+$/.test(value)) return "integer"
  if (/-?\d+\.\d+/.test(value)) return "number"
  if (/^(true|false)$/.test(value)) return "boolean"
  return "string"
}

function parseResponseHeaders(headerArray, responseHeaders) {
  if (!responseHeaders) {
    return {}
  }
  headerArray = headerArray || []
  const headers = headerArray.reduce((acc, { key, value }) => {
    acc[key] = {
      schema: {
        type: inferType(value),
        example: value,
      },
    }
    return acc
  }, {})
  return Object.keys(headers).length > 0 ? { headers } : {}
}

function getVarValue(variables, name, def = undefined) {
  const variable = variables.find(({ key }) => key === name)
  return variable ? variable.value : def
}

module.exports = { inferType, parseResponseHeaders, getVarValue }
