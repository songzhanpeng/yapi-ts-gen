import { defaultConfig } from './config';
import { downloadApiJson } from './fetcher';
import { extractNameAndParams, ParsedApiData, parseJsonSchema } from './parser';
import { generateCode, saveToFile } from './generator';
import { ApiConfig, defaultTemplate } from './template';
import { formatCode } from './utils';

async function main(configs: ApiConfig[] = defaultConfig) {
  for (const config of configs) {
    try {
      console.log(`Downloading API definition from YAPI: ${config.yapiUrl}`);
      const apiJson = await downloadApiJson(config.yapiUrl, config.outputDir, config.outputFileName);

      const allApis = apiJson.flatMap((category: any) => {
        // 过滤掉包含问号的api
        return category.list.filter((api: any) => !api.path.includes("?")).map((api: any) => {
          console.log("api.path", api.path);
          const { functionName, interfaceName } = extractNameAndParams(api.path, api.method);
          let response = "{}";
          try {
            if (api.res_body_type === "json" && api.res_body) {
              response = parseJsonSchema(JSON.parse(api.res_body));
            }
          } catch (error) {
            console.warn(`Warning: Failed to parse response body for ${api.path}:`, error);
          }
          return { 
            functionName, 
            interfaceName, 
            title: api.title, 
            method: api.method, 
            path: api.path.replace(/{/, '${'), 
            params: api.req_query || {}, 
            response: response
          };
        });
      });

      // 使用模板生成代码
      const code = generateCode(allApis, {
        ...defaultTemplate,
        // 可以在这里覆盖默认模板
        ...(config.template || {})
      });
      
      saveToFile(code, `${config.outputDir}/${config.outputFileName}`);
    } catch (error) {
      console.error(`Error processing ${config.yapiUrl}:`, error);
    }
  }
}

main();

