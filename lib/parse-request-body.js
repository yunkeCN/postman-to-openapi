const { inferType, genSchema } = require("./utils")

/* Accumulator function for form data values */
function mapFormData() {
  return (obj, { key, type, description, value, disabled }) => {
    if (disabled) {
      return obj
    }
    obj[key] = {
      type: inferType(value),
      ...(description ? { description: description.replace(/ ?\[required\] ?/gi, "") } : {}),
      ...(value ? { example: value } : {}),
      ...(type === "file" ? { format: "binary" } : {}),
    }
    return obj
  }
}

function parseRequestBody(body = {}, method) {
  // Swagger validation return an error if GET has body
  if (["GET", "DELETE"].includes(method)) return {}
  const { mode, raw, options = { raw: { language: "json" } } } = body
  let content = {}
  switch (mode) {
    case "raw": {
      const {
        raw: { language },
      } = options

      let example = ""
      if (language === "json") {
        let isObject = false
        if (raw) {
          try {
            example = JSON.parse(raw)
            isObject = true
          } catch (e) {
            example = raw
          }
        }

        const schema = genSchema(example)
        content = {
          "application/json": {
            schema: isObject ? schema : {},
            example,
          },
        }
      } else {
        content = {
          "application/json": {
            schema: {
              type: "string",
            },
            example: raw,
          },
        }
      }
      break
    }
    case "file":
      content = {
        "text/plain": {},
      }
      break
    case "formdata":
      content = {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: body.formdata.reduce(mapFormData(), {}),
          },
        },
      }
      break
    case "urlencoded":
      content = {
        "application/x-www-form-urlencoded": {
          schema: {
            properties: body.urlencoded.reduce(mapFormData(), {}),
          },
        },
      }
      break
  }
  return { requestBody: { content } }
}

module.exports = { parseRequestBody }
