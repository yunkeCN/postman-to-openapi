const { parseResponseHeaders, isObjectValueEqual, genSchema } = require("./utils")

function checkIsRepeat(arr, obj) {
  if (arr.length === 0) {
    return false
  }
  return arr.some(item => isObjectValueEqual(item, obj))
}

function parseExamplesJson(bodies) {
  const isMultipleBody = Array.isArray(bodies) && bodies.length > 1
  const examples = {}
  const properties = {
    oneOf: [],
  }
  bodies.forEach((t, i) => {
    const value = JSON.parse(t.body)
    examples[`example-${i}`] = {
      summary: t.name,
      value,
    }
    const schema = genSchema(value)
    if (!checkIsRepeat(properties.oneOf, schema)) {
      properties.oneOf.push(schema)
    }
  })
  const firstIndex = 0
  return Object.assign(
    {
      schema: properties.oneOf.length > 1 ? properties : properties.oneOf[firstIndex],
    },
    isMultipleBody ? { examples } : { example: examples[`example-${firstIndex}`] },
  )
}

function parseExamplesText(bodies) {
  if (Array.isArray(bodies) && bodies.length > 1) {
    return {
      schema: { type: "string" },
      examples: bodies.reduce((ex, { name: summary, body }, i) => {
        ex[`example-${i}`] = {
          summary,
          value: body,
        }
        return ex
      }, {}),
    }
  } else {
    const firstBody = bodies[0]
    return {
      schema: { type: "string" },
      example: firstBody.body,
    }
  }
}

function parseResponseFromExamples(responses, responseHeaders) {
  // Group responses by status code
  const statusCodeMap = responses.reduce(
    (statusMap, { name, code, status: description, header, body, _postman_previewlanguage: language }) => {
      if (code in statusMap) {
        if (!(language in statusMap[code].bodies)) {
          statusMap[code].bodies[language] = []
        }
        statusMap[code].bodies[language].push({ name, body })
      } else {
        statusMap[code] = {
          description,
          header,
          bodies: { [language]: [{ name, body }] },
        }
      }
      return statusMap
    },
    {},
  )
  // Parse for OpenAPI
  const parsedResponses = Object.entries(statusCodeMap).reduce((parsed, [status, { description, header, bodies }]) => {
    parsed[status] = {
      description,
      ...parseResponseHeaders(header, responseHeaders),
      ...parseContent(bodies),
    }
    return parsed
  }, {})
  return { responses: parsedResponses }
}

function parseContent(bodiesByLanguage) {
  const content = Object.entries(bodiesByLanguage).reduce((content, [language, bodies]) => {
    if (language === "json") {
      content["application/json"] = parseExamplesJson(bodies)
    } else {
      content["text/plain"] = parseExamplesText(bodies)
    }
    return content
  }, {})
  return { content }
}

module.exports = { parseResponseFromExamples, parseContent }
