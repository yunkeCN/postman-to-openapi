const postmanToOpenApi = require("../lib/toOpenapi/index")
const { writeJsonSync } = require("fs-extra")
const path = require("path")

const input = {
  info: {
    _postman_id: "f7155358-3328-416b-b1a4-bdd2c32f2a02",
    name: "IP地址查询",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "ip地址查询",
      request: {
        method: "POST",
        header: [],
        body: {
          mode: "raw",
          raw: '{\n    "a": 3\n}',
          options: {
            raw: {
              language: "json",
            },
          },
        },
        url: {
          raw: "http://ip-api.com/json/115.95.175.147",
          protocol: "http",
          host: ["ip-api", "com"],
          path: ["json", "115.95.175.147"],
        },
      },
      response: [
        {
          name: "ip地址查询1",
          originalRequest: {
            method: "POST",
            header: [],
            body: {
              mode: "raw",
              raw: '{\n    "a": 1\n}',
              options: {
                raw: {
                  language: "json",
                },
              },
            },
            url: {
              raw: "http://ip-api.com/json/114.95.175.146",
              protocol: "http",
              host: ["ip-api", "com"],
              path: ["json", "114.95.175.146"],
            },
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            {
              key: "Connection",
              value: "close",
            },
            {
              key: "Content-Length",
              value: "289",
            },
            {
              key: "Access-Control-Allow-Origin",
              value: "*",
            },
            {
              key: "Content-Type",
              value: "application/json; charset=utf-8",
            },
            {
              key: "Date",
              value: "Mon, 27 Dec 2021 11:44:58 GMT",
            },
            {
              key: "X-Rl",
              value: "44",
            },
            {
              key: "X-Ttl",
              value: "60",
            },
          ],
          cookie: [],
          body: '{\n    "status": "success",\n    "country": "China",\n    "countryCode": "CN",\n    "region": "SH",\n    "regionName": "Shanghai",\n    "city": "Shanghai",\n    "zip": "",\n    "lat": 31.0442,\n    "lon": 121.4054,\n    "timezone": "Asia/Shanghai",\n    "isp": "China Telecom (Group)",\n    "org": "Chinanet SH",\n    "as": "AS4812 China Telecom (Group)",\n    "query": "114.95.175.146"\n}',
        },
        {
          name: "ip地址查询2",
          originalRequest: {
            method: "POST",
            header: [],
            body: {
              mode: "raw",
              raw: '{\n    "a": 2\n}',
              options: {
                raw: {
                  language: "json",
                },
              },
            },
            url: {
              raw: "http://ip-api.com/json/115.95.175.147",
              protocol: "http",
              host: ["ip-api", "com"],
              path: ["json", "115.95.175.147"],
            },
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            {
              key: "Connection",
              value: "close",
            },
            {
              key: "Content-Length",
              value: "290",
            },
            {
              key: "Access-Control-Allow-Origin",
              value: "*",
            },
            {
              key: "Content-Type",
              value: "application/json; charset=utf-8",
            },
            {
              key: "Date",
              value: "Mon, 27 Dec 2021 11:45:19 GMT",
            },
            {
              key: "X-Rl",
              value: "41",
            },
            {
              key: "X-Ttl",
              value: "39",
            },
          ],
          cookie: [],
          body: '{\n    "status": "success",\n    "country": "South Korea",\n    "countryCode": "KR",\n    "region": "11",\n    "regionName": "Seoul",\n    "city": "Yongsan-dong",\n    "zip": "04371",\n    "lat": 37.536,\n    "lon": 126.971,\n    "timezone": "Asia/Seoul",\n    "isp": "LG DACOM Corporation",\n    "org": "Boranet",\n    "as": "AS3786 LG DACOM Corporation",\n    "query": "115.95.175.147"\n}',
        },
      ],
    },
  ],
}

const result = postmanToOpenApi(input)

writeJsonSync(path.resolve(__dirname, "./result.json"), result)
