const { parseResponseHeaders } = require("./utils")

function parseExamples(bodies, language) {
  if (Array.isArray(bodies) && bodies.length > 1) {
    return {
      examples: bodies.reduce((ex, { name: summary, body }, i) => {
        ex[`example-${i}`] = {
          summary,
          value: language === "json" ? JSON.parse(body) : body,
        }
        return ex
      }, {}),
    }
  } else {
    return {
      example: language === "json" ? JSON.parse(bodies[0].body) : bodies[0].body,
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
      content["application/json"] = {
        schema: { type: "object" },
        ...parseExamples(bodies, "json"),
      }
    } else {
      content["text/plain"] = {
        schema: { type: "string" },
        ...parseExamples(bodies, "text"),
      }
    }
    return content
  }, {})
  return { content }
}

module.exports = { parseResponseFromExamples, parseContent }
