import { downloadApiJson } from './fetcher';
import { extractNameAndParams, ParsedApiData, parseJsonSchema } from './parser';
import { generateCode, saveToFile } from './generator';
import { formatCode } from './utils';
import { ApiConfig, YapiApiData, YapiCategory, YapiQueryParam, CustomOutputRule } from './types';

export async function main(configs: ApiConfig[]) {
  let successCount = 0;
  let errorCount = 0;

  for (const config of configs) {
    try {
      console.log(`Downloading API definition from YAPI: ${config.yapiUrl}`);
      const apiJson = await downloadApiJson(config.yapiUrl, config.outputDir, config.outputFileName);

      // 处理 API 数据
      const processApi = (api: any) => {
        try {
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

          // If no required fields are specified, remove the required property
          if (paramSchema.required?.length === 0) {
            delete paramSchema.required;
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
            title: api.title || functionName, 
            method: api.method, 
            path: api.path,
            params: parseJsonSchema(paramSchema),
            pathParams,
            response,
            yapiBaseUrl: api.yapiBaseUrl || config.yapiBaseUrl,
            projectId: api.project_id || api.projectId,
            apiId: api._id || api.apiId,
            hasRequiredParams: !!paramSchema.required?.length,
          };
        } catch (err) {
          console.error(`Error processing API ${api.path || 'unknown'}:`, err);
          return null;
        }
      };

      let allApis: ParsedApiData[] = [];

      if (Array.isArray(apiJson)) {
        // 处理分类数组
        allApis = apiJson.flatMap((category: YapiCategory) => {
          if (!category.list) return [];
          return category.list.map(processApi).filter(Boolean) as ParsedApiData[];
        });
      } else if (apiJson.list && Array.isArray(apiJson.list)) {
        // 处理单个分类
        allApis = apiJson.list.map(processApi).filter(Boolean) as ParsedApiData[];
      } else if (apiJson._id || apiJson.apiId) {
        // 处理单个接口
        const api = processApi(apiJson);
        if (api) allApis = [api];
      }

      if (allApis.length === 0) {
        console.warn(`Warning: No APIs found in ${config.yapiUrl}`);
        continue;
      }

      console.log(`Generated ${allApis.length} API interfaces.`);

      // 新增：根据 customOutputs 规则分组接口
      if (config.customOutputs && config.customOutputs.length > 0) {
        const apiGroups = new Map<string, ParsedApiData[]>();
        const unmatchedApis: ParsedApiData[] = [];

        // 为每个自定义输出规则初始化空数组
        config.customOutputs.forEach(rule => {
          apiGroups.set(rule.outputFileName, []);
        });

        // 对每个接口进行分组
        allApis.forEach(api => {
          let matched = false;
          console.log(api.path);
          
          // 检查是否匹配任何自定义输出规则
          for (const rule of config.customOutputs!) {
            for (const match of rule.matches) {
              if (api.path.startsWith(match)) {
                apiGroups.get(rule.outputFileName)!.push(api);
                matched = true;
                break;
              }
            }
            if (matched) break;
          }

          // 如果没有匹配任何规则，则放入默认组
          if (!matched) {
            unmatchedApis.push(api);
          }
        });

        // 生成自定义输出文件
        for (const [fileName, apis] of apiGroups.entries()) {
          if (apis.length > 0) {
            const code = generateCode(apis, config.requestImportPath || '@/utils/request');
            const formattedCode = await formatCode(code);
            saveToFile(formattedCode, `${config.outputDir}/${fileName}`);
            console.log(`Generated ${apis.length} interfaces to ${fileName}`);
          }
        }

        // 生成默认输出文件（包含未匹配的接口）
        if (unmatchedApis.length > 0) {
          const code = generateCode(unmatchedApis, config.requestImportPath || '@/utils/request');
          const formattedCode = await formatCode(code);
          saveToFile(formattedCode, `${config.outputDir}/${config.outputFileName}`);
          console.log(`Generated ${unmatchedApis.length} interfaces to ${config.outputFileName} (default)`);
        }
      } else {
        // 原有逻辑：所有接口输出到一个文件
        const code = generateCode(allApis, config.requestImportPath || '@/utils/request');
        const formattedCode = await formatCode(code);
        saveToFile(formattedCode, `${config.outputDir}/${config.outputFileName}`);
      }

      successCount++;
    } catch (error) {
      console.error(`Error processing ${config.yapiUrl}:`, error);
      errorCount++;
    }
  }

  console.log(`\nYAPI TypeScript API Generator Summary:`);
  console.log(`- Successfully processed: ${successCount} API configurations`);
  console.log(`- Failed: ${errorCount} API configurations`);
  return { success: successCount, errors: errorCount };
}

