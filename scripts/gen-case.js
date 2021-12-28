"use strict"

const { postmanToOpenApi } = require("../test/transformer")

const COLLECTION_NO_OPTIONS = "./test/resources/input/NoOptionsInBody.json"
const COLLECTION_NULL_HEADERS = "./test/resources/input/NullHeaders.json"

const EXPECTED_BASIC = "./test/resources/output/Basic.yml"
const EXPECTED_INFO_OPTS = "./test/resources/output/InfoOpts.yml"
const EXPECTED_NO_VERSION = "./test/resources/output/NoVersion.yml"
const EXPECTED_CUSTOM_TAG = "./test/resources/output/CustomTag.yml"
const EXPECTED_FOLDERS = "./test/resources/output/Folders.yml"
const EXPECTED_FOLDERS_NO_CONCAT = "./test/resources/output/FoldersNoConcat.yml"
const EXPECTED_FOLDERS_SEPARATOR = "./test/resources/output/FoldersSeparator.yml"
const EXPECTED_GET_METHODS = "./test/resources/output/GetMethods.yml"
const EXPECTED_HEADERS = "./test/resources/output/Headers.yml"
const EXPECTED_AUTH_BEARER = "./test/resources/output/AuthBearer.yml"
const EXPECTED_AUTH_BASIC = "./test/resources/output/AuthBasic.yml"
const EXPECTED_BASIC_WITH_AUTH = "./test/resources/output/BasicWithAuth.yml"
const EXPECTED_AUTH_MULTIPLE = "./test/resources/output/AuthMultiple.yml"
const EXPECTED_PATH_PARAMS = "./test/resources/output/PathParams.yml"
const EXPECTED_MULTIPLE_SERVERS = "./test/resources/output/MultipleServers.yml"
const EXPECTED_SERVERS_OPTIONS = "./test/resources/output/ServersOpts.yml"
const EXPECTED_NO_SERVERS = "./test/resources/output/NoServers.yml"
const EXPECTED_LICENSE_CONTACT = "./test/resources/output/LicenseContact.yml"
const EXPECTED_LICENSE_CONTACT_OPT = "./test/resources/output/LicenseContactOpts.yml"
const EXPECTED_LICENSE_CONTACT_PARTIAL = "./test/resources/output/LicenseContactPartial.yml"
const EXPECTED_LICENSE_CONTACT_PARTIAL_2 = "./test/resources/output/LicenseContactPartial2.yml"
const EXPECTED_DEPTH_PATH_PARAMS = "./test/resources/output/DepthPathParams.yml"
const EXPECTED_PARSE_STATUS_CODE = "./test/resources/output/ParseStatus.yml"
const EXPECTED_NO_PATH = "./test/resources/output/NoPath.yml"
const EXPECTED_DELETE = "./test/resources/output/DeleteOperation.yml"
const EXPECTED_URL_WITH_PORT = "./test/resources/output/UrlWithPort.yml"
const EXPECTED_EXTERNAL_DOCS = "./test/resources/output/ExternalDocs.yml"
const EXPECTED_EXTERNAL_DOCS_OPTS = "./test/resources/output/ExternalDocsOpts.yml"
const EXPECTED_EXTERNAL_DOCS_OPTS_PARTIAL = "./test/resources/output/ExternalDocsOptsPartial.yml"
const EXPECTED_EMPTY_URL = "./test/resources/output/EmptyUrl.yml"
const EXPECTED_X_LOGO = "./test/resources/output/XLogo.yml"
const EXPECTED_X_LOGO_VAR = "./test/resources/output/XLogoVar.yml"
const EXPECTED_AUTH_OPTIONS = "./test/resources/output/AuthOptions.yml"
const EXPECTED_RESPONSES = "./test/resources/output/Responses.yml"
const EXPECTED_RESPONSES_MULTI_LANG = "./test/resources/output/ResponsesMultiLang.yml"
const EXPECTED_AUTH_REQUEST = "./test/resources/output/AuthRequest.yml"
const EXPECTED_RESPONSES_NO_HEADERS = "./test/resources/output/ResponsesNoHeaders.yml"
const EXPECTED_FORM_DATA = "./test/resources/output/FormData.yml"
const EXPECTED_FORM_URLENCODED = "./test/resources/output/FormUrlencoded.yml"
const EXPECTED_VARIABLES = "./test/resources/output/Variables.yml"
const EXPECTED_VARIABLES_ADDITIONAL = "./test/resources/output/VariablesAdditional.yml"
const EXPECTED_BASEPATH_VAR = "./test/resources/output/BasepathVar.yml"
const EXPECTED_RAW_BODY = "./test/resources/output/RawBody.yml"
const EXPECTED_NULL_HEADER = "./test/resources/output/NullHeader.yml"
const EXPECTED_COLLECTION_WRAPPER = "./test/resources/output/CollectionWrapper.yml"

const AUTH_DEFINITIONS = {
  myCustomAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "A resource owner JWT",
    description: "My awesome authentication using bearer",
  },
  myCustomAuth2: {
    type: "http",
    scheme: "basic",
    description: "My awesome authentication using user and password",
  },
  notSupported: {
    type: "http",
    scheme: "digest",
    description: "Not supported security",
  },
}

const TEST_VERSIONS = ["v2", "v21"]

TEST_VERSIONS.forEach(function (version) {
  const COLLECTION_BASIC = `./test/resources/input/${version}/PostmantoOpenAPI.json`
  const COLLECTION_SIMPLE = `./test/resources/input/${version}/SimplePost.json`
  const COLLECTION_NO_VERSION = `./test/resources/input/${version}/NoVersion.json`
  const COLLECTION_FOLDERS = `./test/resources/input/${version}/FolderCollection.json`
  const COLLECTION_GET = `./test/resources/input/${version}/GetMethods.json`
  const COLLECTION_HEADERS = `./test/resources/input/${version}/Headers.json`
  const COLLECTION_PATH_PARAMS = `./test/resources/input/${version}/PathParams.json`
  const COLLECTION_MULTIPLE_SERVERS = `./test/resources/input/${version}/MultipleServers.json`
  const COLLECTION_LICENSE_CONTACT = `./test/resources/input/${version}/LicenseContact.json`
  const COLLECTION_DEPTH_PATH_PARAMS = `./test/resources/input/${version}/DepthPathParams.json`
  const COLLECTION_PARSE_STATUS_CODE = `./test/resources/input/${version}/ParseStatusCode.json`
  const COLLECTION_NO_PATH = `./test/resources/input/${version}/NoPath.json`
  const COLLECTION_DELETE = `./test/resources/input/${version}/DeleteOperation.json`
  const COLLECTION_AUTH_BEARER = `./test/resources/input/${version}/AuthBearer.json`
  const COLLECTION_AUTH_BASIC = `./test/resources/input/${version}/AuthBasic.json`
  const COLLECTION_URL_WITH_PORT = `./test/resources/input/${version}/UrlWithPort.json`
  const COLLECTION_EXTERNAL_DOCS = `./test/resources/input/${version}/ExternalDocs.json`
  const COLLECTION_EMPTY_URL = `./test/resources/input/${version}/EmptyUrl.json`
  const COLLECTION_XLOGO = `./test/resources/input/${version}/XLogo.json`
  const COLLECTION_MULTI_AUTH = `./test/resources/input/${version}/AuthMultiple.json`
  const COLLECTION_RESPONSES = `./test/resources/input/${version}/Responses.json`
  const COLLECTION_RESPONSES_MULTI_LANG = `./test/resources/input/${version}/ResponsesMultiLang.json`
  const COLLECTION_AUTH_REQUEST = `./test/resources/input/${version}/AuthRequest.json`
  const COLLECTION_FORM_DATA = `./test/resources/input/${version}/FormData.json`
  const COLLECTION_FORM_URLENCODED = `./test/resources/input/${version}/FormUrlencoded.json`
  const COLLECTION_VARIABLES = `./test/resources/input/${version}/Variables.json`
  const COLLECTION_BASEURL_VAR = `./test/resources/input/${version}/BasepathVar.json`
  const COLLECTION_RAW_BODY = `./test/resources/input/${version}/RawBody.json`
  const COLLECTION_COLLECTION_WRAPPER = `./test/resources/input/${version}/CollectionWrapper.json`

  postmanToOpenApi(COLLECTION_BASIC, EXPECTED_BASIC, {})

  postmanToOpenApi(COLLECTION_BASIC, null)

  postmanToOpenApi(COLLECTION_SIMPLE, EXPECTED_INFO_OPTS, {
    info: {
      title: "Options title",
      version: "6.0.7-beta",
      description: "Description from options",
      termsOfService: "http://tos.myweb.com",
    },
  })

  postmanToOpenApi(COLLECTION_SIMPLE, EXPECTED_CUSTOM_TAG, { defaultTag: "Custom Tag" })

  postmanToOpenApi(COLLECTION_NO_VERSION, EXPECTED_NO_VERSION, {})

  postmanToOpenApi(COLLECTION_FOLDERS, EXPECTED_FOLDERS)

  postmanToOpenApi(COLLECTION_FOLDERS, EXPECTED_FOLDERS_SEPARATOR, { folders: { separator: "-" } })

  postmanToOpenApi(COLLECTION_FOLDERS, EXPECTED_FOLDERS_NO_CONCAT, { folders: { concat: false } })

  postmanToOpenApi(COLLECTION_GET, EXPECTED_GET_METHODS)

  postmanToOpenApi(COLLECTION_HEADERS, EXPECTED_HEADERS)

  postmanToOpenApi(COLLECTION_PATH_PARAMS, EXPECTED_PATH_PARAMS)

  postmanToOpenApi(COLLECTION_MULTIPLE_SERVERS, EXPECTED_MULTIPLE_SERVERS)

  postmanToOpenApi(COLLECTION_MULTIPLE_SERVERS, EXPECTED_SERVERS_OPTIONS, {
    servers: [
      {
        url: "https://awesome.api.sandbox.io",
        description: "Sandbox environment server",
      },
      {
        url: "https://awesome.api.io",
        description: "Production env",
      },
    ],
  })

  postmanToOpenApi(COLLECTION_MULTIPLE_SERVERS, EXPECTED_NO_SERVERS, { servers: [] })

  postmanToOpenApi(COLLECTION_LICENSE_CONTACT, EXPECTED_LICENSE_CONTACT)

  postmanToOpenApi(COLLECTION_LICENSE_CONTACT, EXPECTED_LICENSE_CONTACT_OPT, {
    info: {
      license: {
        name: "MIT",
        url: "https://es.wikipedia.org/wiki/Licencia_MIT",
      },
      contact: {
        name: "My Support",
        url: "http://www.api.com/support",
        email: "support@api.com",
      },
    },
  })

  postmanToOpenApi(COLLECTION_BASIC, EXPECTED_LICENSE_CONTACT_PARTIAL, {
    info: {
      license: {
        name: "MIT",
      },
      contact: {
        name: "My Support",
      },
    },
  })

  postmanToOpenApi(COLLECTION_BASIC, EXPECTED_LICENSE_CONTACT_PARTIAL_2, {
    info: {
      license: {
        name: "MIT",
      },
      contact: {
        url: "http://www.api.com/support",
      },
    },
  })

  postmanToOpenApi(COLLECTION_BASIC, EXPECTED_BASIC, {
    info: {
      license: {},
      contact: {},
    },
  })

  postmanToOpenApi(COLLECTION_BASIC, EXPECTED_BASIC, {
    auth: {},
  })

  postmanToOpenApi(COLLECTION_DEPTH_PATH_PARAMS, EXPECTED_DEPTH_PATH_PARAMS, { pathDepth: 1 })

  postmanToOpenApi(COLLECTION_PARSE_STATUS_CODE, EXPECTED_PARSE_STATUS_CODE)

  postmanToOpenApi(COLLECTION_NO_PATH, EXPECTED_NO_PATH)

  postmanToOpenApi(COLLECTION_DELETE, EXPECTED_DELETE)

  postmanToOpenApi(COLLECTION_AUTH_BEARER, EXPECTED_AUTH_BEARER)

  postmanToOpenApi(COLLECTION_AUTH_BASIC, EXPECTED_AUTH_BASIC)

  postmanToOpenApi(COLLECTION_BASIC, EXPECTED_BASIC_WITH_AUTH, { auth: AUTH_DEFINITIONS })

  postmanToOpenApi(COLLECTION_URL_WITH_PORT, EXPECTED_URL_WITH_PORT)

  postmanToOpenApi(COLLECTION_EXTERNAL_DOCS, EXPECTED_EXTERNAL_DOCS)

  postmanToOpenApi(COLLECTION_EXTERNAL_DOCS, EXPECTED_EXTERNAL_DOCS_OPTS, {
    externalDocs: {
      url: "https://docs2.example.com",
      description: "Find more info here or there",
    },
  })

  postmanToOpenApi(COLLECTION_BASIC, EXPECTED_EXTERNAL_DOCS_OPTS_PARTIAL, {
    externalDocs: {
      url: "https://docs2.example.com",
    },
  })

  postmanToOpenApi(COLLECTION_EMPTY_URL, EXPECTED_EMPTY_URL)

  postmanToOpenApi(COLLECTION_XLOGO, EXPECTED_X_LOGO, {
    info: {
      xLogo: {
        url: "https://github.com/joolfe/logoBanner.png",
        backgroundColor: "#FFFFFF",
        altText: "Example logo",
      },
    },
  })

  postmanToOpenApi(COLLECTION_XLOGO, EXPECTED_X_LOGO, {
    info: {
      xLogo: {
        url: "https://github.com/joolfe/logoBanner.png",
        backgroundColor: "#FFFFFF",
        altText: "Example logo",
        incorrect: "field",
      },
    },
  })

  postmanToOpenApi(COLLECTION_XLOGO, EXPECTED_X_LOGO_VAR, {})

  postmanToOpenApi(COLLECTION_MULTI_AUTH, EXPECTED_AUTH_MULTIPLE, {})

  postmanToOpenApi(COLLECTION_MULTI_AUTH, EXPECTED_AUTH_OPTIONS, { auth: AUTH_DEFINITIONS })

  postmanToOpenApi(COLLECTION_RESPONSES, EXPECTED_RESPONSES, { pathDepth: 2 })

  postmanToOpenApi(COLLECTION_RESPONSES_MULTI_LANG, EXPECTED_RESPONSES_MULTI_LANG, { pathDepth: 2 })

  postmanToOpenApi(COLLECTION_AUTH_REQUEST, EXPECTED_AUTH_REQUEST, {})

  postmanToOpenApi(COLLECTION_RESPONSES, EXPECTED_RESPONSES_NO_HEADERS, {
    pathDepth: 2,
    responseHeaders: false,
  })

  postmanToOpenApi(COLLECTION_FORM_DATA, EXPECTED_FORM_DATA, {})

  postmanToOpenApi(COLLECTION_FORM_URLENCODED, EXPECTED_FORM_URLENCODED, {})

  postmanToOpenApi(COLLECTION_VARIABLES, EXPECTED_VARIABLES, { replaceVars: true })

  postmanToOpenApi(COLLECTION_VARIABLES, EXPECTED_VARIABLES_ADDITIONAL, {
    replaceVars: true,
    additionalVars: {
      company: "myCompany",
      service: "myService",
    },
  })

  postmanToOpenApi(COLLECTION_FORM_DATA, EXPECTED_FORM_DATA, { replaceVars: true })

  postmanToOpenApi(COLLECTION_BASEURL_VAR, EXPECTED_BASEPATH_VAR, {
    servers: [
      {
        url: "https://awesome.api.sandbox.io",
        description: "Sandbox environment server",
      },
      {
        url: "https://awesome.api.io",
        description: "Production env",
      },
    ],
  })

  postmanToOpenApi(COLLECTION_RAW_BODY, EXPECTED_RAW_BODY, {})

  postmanToOpenApi(COLLECTION_COLLECTION_WRAPPER, EXPECTED_COLLECTION_WRAPPER, {})

  postmanToOpenApi(COLLECTION_NO_OPTIONS, EXPECTED_BASIC, {})

  postmanToOpenApi(COLLECTION_NULL_HEADERS, EXPECTED_NULL_HEADER, {})
})
