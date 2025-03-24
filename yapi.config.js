const config = [
  {
    "yapiUrl": "http://iauto-yapi.ci.iauto.com/api/open/plugin/export-full?type=json&pid=545&status=all&token=0b8c264fd29c94bea17a897867815943f0e2c89b9a04a0920378ce457eb1906d",
    "outputDir": "./src/api",
    "outputFileName": "api.ts",
    "namespace": "API",
    "stripPathPrefixes": [
      "/svc/api/v1",
    ],
    "requestImportPath": "@/utils/request",
    "yapiBaseUrl": "http://iauto-yapi.ci.iauto.com"
  }
];

module.exports = config;
