const config = [
  {
    yapiUrl: "http://iauto-yapi.ci.iauto.com/api/open/plugin/export-full?type=json&pid=548&status=all&token=xxxxx",
    outputDir: "./tcms",
    outputFileName: "index.ts", // 默认输出文件，不匹配自定义规则的接口会输出到这里
    namespace: "TCMS",
    stripPathPrefixes: ["/api/trace_matrix"],
    requestImportPath: "@/hooks/web/useAxios",

    // 新功能：自定义输出规则 - 多个接口输出到同一个文件npm
    customOutputs: [
      {
        matches: [ // 多个路径前缀，以这些路径开头的接口会被分组到同一个文件
          "/api",
        ],
        outputFileName: "feature.ts", // 输出文件名
      },
    ]
  }
];

module.exports = config;