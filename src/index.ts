import { defaultConfig, ApiConfig } from './config';
import { downloadApiJson } from './fetcher';
import { extractNameAndParams, ParsedApiData, parseJsonSchema } from './parser';
import { generateCode, saveToFile } from './generator';
import { defaultTemplate } from './template';

async function main(configs: ApiConfig[] = defaultConfig) {
  for (const config of configs) {
    try {
      console.log(`Downloading API definition from YAPI: ${config.yapiUrl}`);
      const apiJson = await downloadApiJson(config.yapiUrl, config.outputDir, config.outputFileName);

      const allApis = apiJson.flatMap((category: any) => {
        return category.list.map((api: any) => {
          const { functionName, interfaceName } = extractNameAndParams(api.path, api.method);
          let response = {};
          try {
            if (api.res_body) {
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
            path: api.path, 
            params: api.req_query || {}, 
            response 
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

