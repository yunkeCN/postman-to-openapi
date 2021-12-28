![logo](./docs/assets/img/logoBanner.png)

# [postman-to-openapi](https://joolfe.github.io/postman-to-openapi/)

🛸 Convert Postman Collection v2.1/v2.0 to OpenAPI v3.0.

Or in other words, transform [this specification](https://schema.getpostman.com/json/collection/v2.1.0/collection.json) and [also this](https://schema.getpostman.com/json/collection/v2.0.0/collection.json) to [this one](http://spec.openapis.org/oas/v3.0.3.html)

[![build](https://github.com/joolfe/postman-to-openapi/workflows/Build/badge.svg)](https://github.com/joolfe/postman-to-openapi/actions)
[![codecov](https://codecov.io/gh/joolfe/postman-to-openapi/branch/master/graph/badge.svg)](https://codecov.io/gh/joolfe/postman-to-openapi)
[![npm version](https://img.shields.io/npm/v/postman-to-openapi)](https://www.npmjs.com/package/postman-to-openapi)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![CodeQL](https://github.com/joolfe/postman-to-openapi/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/joolfe/postman-to-openapi/actions/workflows/codeql-analysis.yml)

## Development

This project use for development:

- Node.js v10.15.3 or higher
- [Standard JS](https://standardjs.com/) rules to maintain clean code.
- Use [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.
- Test with [mocha.js](https://mochajs.org/).

Use the scripts in `package.json`:

- `test:unit`: Run mocha unit test.
- `test`: Execute `test:lint` plus code coverage.
- `lint`: Execute standard lint to review errors in code.
- `lint:fix`: Execute standard lint and automatically fix errors.
- `changelog`: Update changelog automatically.

[Husky](https://www.npmjs.com/package/husky) is configured to avoid push incorrect content to git.

## Tags

`Nodejs` `Javascript` `OpenAPI` `Postman` `Newman` `Collection` `Transform` `Convert`

## What I've done is

- Adjust API
- Use the examples for building the schemas using: https://github.com/Nijikokun/generate-schema
- `fs` removed for browser
- Unsupported Console

## Reconstruct test cases & do test

node scripts/gen-case.js && yarn test

## License

See the [LICENSE](LICENSE.txt) file.
