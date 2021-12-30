"use strict"

const { parseMdTable } = require("./md-utils")
const { version } = require("../package.json")
const jsyaml = require("js-yaml")
const replacePostmanVariables = require("./var-replacer")
const { inferType, getVarValue } = require("./utils")
const { parseRequestBody } = require("./parse-request-body")
const { parseParameters } = require("./parse-parameters")
const { parseResponse } = require("./parse-response")
const { parseAuth } = require("./parse-auth")
const { compileInfo } = require("./compile-info")

function postmanToOpenApi(
  input,
  {
    info = {},
    defaultTag = "default",
    pathDepth = 0,
    auth: optsAuth,
    servers,
    externalDocs = {},
    folders = {},
    responseHeaders = true,
    replaceVars = false,
    additionalVars = {},
    outputType = "yml" || "json",
  } = {},
) {
  if (!input && Object.prototype.toString.call(input) === "[object Object]") {
    return "input is required"
  }
  if (Object.prototype.toString.call(input) !== "[object Object]") {
    return "input must be an object"
  }
  let collectionFile = JSON.stringify(input)
  if (replaceVars) {
    collectionFile = replacePostmanVariables(collectionFile, additionalVars)
  }
  const _postmanJson = JSON.parse(collectionFile)
  const postmanJson = _postmanJson.collection || _postmanJson
  const { item: items, variable = [] } = postmanJson
  const paths = {}
  const domains = new Set()
  const tags = {}
  const securitySchemes = {}

  for (let [i, element] of items.entries()) {
    while (element.item != null) {
      // is a folder
      const { item, description: tagDesc } = element
      const tag = calculateFolderTag(element, folders)
      const tagged = item.map(e => ({ ...e, tag }))
      tags[tag] = tagDesc
      items.splice(i, 1, ...tagged)
      // Empty folders will have tagged empty
      element = tagged.length > 0 ? tagged.shift() : items[i]
    }
    const {
      request: { url, method, body, description: rawDesc, header, auth },
      name: summary,
      tag = defaultTag,
      event: events,
      response,
    } = element
    let scrapeResult
    try {
      scrapeResult = scrapeURL(url)
    } catch (e) {
      const rawUrl = typeof url === "string" || url instanceof String ? url : url.raw
      throw Error(
        `${tag}-${summary}-${rawUrl}: ${e?.message || e}`
      )
    }
    const { path, query, protocol, host, port, valid, pathVars } = scrapeResult
    if (valid) {
      domains.add(calculateDomains(protocol, host, port))
      const joinedPath = calculatePath(path, pathDepth)
      if (!paths[joinedPath]) paths[joinedPath] = {}
      const { description, paramsMeta } = descriptionParse(rawDesc)
      paths[joinedPath][method.toLowerCase()] = {
        tags: [tag],
        summary,
        ...(description ? { description } : {}),
        ...parseRequestBody(body, method),
        ...parseOperationAuth(auth, securitySchemes, optsAuth),
        ...parseParameters(query, header, joinedPath, paramsMeta, pathVars),
        ...parseResponse(response, events, responseHeaders),
      }
    }
  }

  const openApi = {
    openapi: "3.0.0",
    info: compileInfo(postmanJson, info),
    ...parseExternalDocs(variable, externalDocs),
    ...parseServers(domains, servers),
    ...parseAuth(postmanJson, optsAuth, securitySchemes),
    ...parseTags(tags),
    paths,
  }

  if (outputType === "json") {
    return openApi
  } else {
    const doc = jsyaml.dump(openApi, { skipInvalid: true })
    return doc
  }
}

/* Calculate the tags for folders items based on the options */
function calculateFolderTag({ tag, name }, { separator = " > ", concat = true }) {
  return tag && concat ? `${tag}${separator}${name}` : name
}

function parseExternalDocs(variables, optsExternalDocs) {
  const descriptionVar = getVarValue(variables, "externalDocs.description")
  const urlVar = getVarValue(variables, "externalDocs.url")
  const { description = descriptionVar, url = urlVar } = optsExternalDocs
  return url != null ? { externalDocs: { url, ...(description ? { description } : {}) } } : {}
}

/* Parse Auth at operation/request level */
function parseOperationAuth(auth, securitySchemes, optsAuth) {
  if (auth == null || optsAuth != null) {
    // In case of config auth operation auth is disabled
    return {}
  } else {
    const { type } = auth
    securitySchemes[`${type}Auth`] = {
      type: "http",
      scheme: type,
    }
    return {
      security: [{ [`${type}Auth`]: [] }],
    }
  }
}

/* From the path array compose the real path for OpenApi specs */
function calculatePath(paths, pathDepth) {
  paths = paths.slice(pathDepth) // path depth
  // replace repeated '{' and '}' chars
  // replace `:` chars at first
  return (
    "/" +
    paths
      .map(path => {
        path = path.replace(/([{}])\1+/g, "$1")
        path = path.replace(/^:(.*)/g, "{$1}")
        return path
      })
      .join("/")
  )
}

function calculateDomains(protocol, hosts, port) {
  return protocol + "://" + hosts.join(".") + (port ? `:${port}` : "")
}

/**
 * To support postman collection v2 and variable replace we should parse the `url` or `url.raw` data
 * without trust in the object as in v2 could not exist and if replaceVars = true then values cannot
 * be correctly parsed
 * @param {Object | String} url
 * @returns a url structure as in postman v2.1 collections
 */
function scrapeURL(url) {
  // Avoid parse empty url request
  if (url === "" || url.raw === "") {
    return { valid: false }
  }
  const rawUrl = typeof url === "string" || url instanceof String ? url : url.raw
  // Fix for issue #136 if replace vars are not used then new URL throw an error
  // when using variables before the schema
  const fixedUrl = rawUrl.startsWith("{{") ? "http://" + rawUrl : rawUrl
  const objUrl = new URL(fixedUrl)
  return {
    raw: rawUrl,
    path: decodeURIComponent(objUrl.pathname).slice(1).split("/"),
    query: compoundQueryParams(objUrl.searchParams, url.query),
    protocol: objUrl.protocol.slice(0, -1),
    host: decodeURIComponent(objUrl.hostname).split("."),
    port: objUrl.port,
    valid: true,
    pathVars:
      url.variable == null
        ? {}
        : url.variable.reduce((obj, { key, value, description }) => {
            obj[key] = { value, description, type: inferType(value) }
            return obj
          }, {}),
  }
}

/**
 * Calculate query parameters as postman collection
 * @param {*} searchParams The searchParam instance from an URL object
 * @param {*} queryCollection The postman collection query section
 * @returns A query params array as created by postman collections Array(Obj)
 */
function compoundQueryParams(searchParams, queryCollection = []) {
  // Prepare desc in query collection for easy search
  const descMap = queryCollection.reduce((agr, { key, description }) => {
    agr[key] = description
    return agr
  }, {})
  // Create the query array of objects
  const query = []
  searchParams.forEach((value, key) => {
    query.push({
      key,
      value,
      ...(descMap[key] != null ? { description: descMap[key] } : {}),
    })
  })
  return query
}

/* Parse domains from operations or options */
function parseServers(domains, serversOpts) {
  let servers
  if (serversOpts != null) {
    // This map is just to filter not supported fields while no validations are implemented
    servers = serversOpts.map(({ url, description }) => ({ url, description }))
  } else {
    servers = Array.from(domains).map(domain => ({ url: domain }))
  }
  return servers.length > 0 ? { servers } : {}
}

/* Transform a object of tags in an array of tags */
function parseTags(tagsObj) {
  const tags = Object.entries(tagsObj).map(([name, description]) => ({ name, description }))
  return tags.length > 0 ? { tags } : {}
}

function descriptionParse(description) {
  if (description == null) return { description }
  const splitDesc = description.split(/# postman-to-openapi/gi)
  if (splitDesc.length === 1) return { description }
  return {
    description: splitDesc[0].trim(),
    paramsMeta: parseMdTable(splitDesc[1]),
  }
}

postmanToOpenApi.version = version

module.exports = postmanToOpenApi
