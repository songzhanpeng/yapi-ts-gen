import { downloadApiJson } from './fetcher';
import { extractNameAndParams, ParsedApiData, parseJsonSchema } from './parser';
import { generateCode, saveToFile } from './generator';
import { formatCode } from './utils';
import { ApiConfig, YapiApiData, YapiCategory, YapiQueryParam } from './types';

export async function main(configs: ApiConfig[]) {
  for (const config of configs) {
    try {
      console.log(`Downloading API definition from YAPI: ${config.yapiUrl}`);
      const apiJson = await downloadApiJson(config.yapiUrl, config.outputDir, config.outputFileName);

      // 处理 API 数据
      const processApi = (api: any) => {
        // 移除 URL 中的查询参数部分，只保留路径部分
        const pathWithoutQuery = api.path.split('?')[0];
        
        const { functionName, interfaceName, pathParams } = extractNameAndParams(
          pathWithoutQuery, 
          api.method,
          config.stripPathPrefixes
        );
        
        // 构建参数对象
        const paramSchema: {
          type: string;
          properties: Record<string, any>;
          required?: string[];
        } = {
          type: 'object',
          properties: {},
          required: []
        };

        // 添加路径参数
        pathParams.forEach(param => {
          paramSchema.properties[param] = {
            type: 'string',
            description: '路径参数'
          };
          paramSchema.required?.push(param);
        });

        // 添加查询参数或请求体参数
        if (api.method.toLowerCase() === 'get' && api.req_query) {
          api.req_query.forEach((query: YapiQueryParam) => {
            paramSchema.properties[query.name] = {
              type: query.type || 'string',
              description: query.desc ? query.desc.split('\n').map((line: string) => line.trim()).join(' ') : '查询参数'
            };
            if (query.required === '1') {
              paramSchema.required?.push(query.name);
            }
          });
        } else if (api.req_body_other) {
          try {
            const bodySchema = JSON.parse(api.req_body_other);
            if (bodySchema.properties) {
              Object.entries(bodySchema.properties).forEach(([key, value]) => {
                paramSchema.properties[key] = value;
              });
              if (bodySchema.required) {
                paramSchema.required = bodySchema.required;
              }
            }
          } catch (error) {
            console.warn(`Warning: Failed to parse request body for ${api.path}:`, error);
          }
        }

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
          path: api.path,
          params: parseJsonSchema(paramSchema),
          pathParams,
          response,
          yapiBaseUrl: api.yapiBaseUrl,
          projectId: api.project_id || api.projectId,
          apiId: api._id || api.apiId,
        };
      };

      let allApis: ParsedApiData[] = [];

      if (Array.isArray(apiJson)) {
        // 处理分类数组
        allApis = apiJson.flatMap((category: YapiCategory) => {
          if (!category.list) return [];
          return category.list.map(processApi);
        });
      } else if (apiJson.list && Array.isArray(apiJson.list)) {
        // 处理单个分类
        allApis = apiJson.list.map(processApi);
      } else if (apiJson._id || apiJson.apiId) {
        // 处理单个接口
        allApis = [processApi(apiJson)];
      }

      if (allApis.length === 0) {
        console.warn(`Warning: No APIs found in ${config.yapiUrl}`);
        continue;
      }

      const code = generateCode(allApis, config.requestImportPath);
      const formattedCode = await formatCode(code);
      saveToFile(formattedCode, `${config.outputDir}/${config.outputFileName}`);
    } catch (error) {
      console.error(`Error processing ${config.yapiUrl}:`, error);
    }
  }
}

