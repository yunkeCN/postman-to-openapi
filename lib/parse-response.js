const { parseResponseFromExamples } = require("./parse-examples")

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
    status = result && result[1] != null ? result[1] : result && result[2] != null ? result[2] : status
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
