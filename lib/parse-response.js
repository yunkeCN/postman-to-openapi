const { parseResponseFromExamples } = require("./parse-examples")
const { isValNotEmpty } = require('./utils')

function parseResponse(responses, events, responseHeaders) {
  if (responses != null && Array.isArray(responses) && responses.length > 0) {
    return parseResponseFromExamples(responses, responseHeaders)
  } else {
    return { responses: parseResponseFromEvents(events) }
  }
}

function parseResponseFromEvents(events = []) {
  let status = 200
  const test = events.filter(event => event.listen === "test")
  if (test.length > 0) {
    const script = test[0].script.exec.join()
    const result = script.match(/\.response\.code\)\.to\.eql\((\d{3})\)|\.to\.have\.status\((\d{3})\)/)
    if (result && isValNotEmpty(result[1])) {
      status = result[1]
    } else if (result && isValNotEmpty(result[2])) {
      status = result[2]
    }
  }
  return {
    [status]: {
      description: "Successful response",
      content: {
        "application/json": {},
      },
    },
  }
}

module.exports = { parseResponse }
