import { ParsedApiData } from './parser';
import fs from 'fs';

function generateInterface(apiData: ParsedApiData): string {
  const { 
    title, 
    interfaceName, 
    functionName, 
    method, 
    path, 
    params, 
    response, 
    pathParams 
  } = apiData;

  const hasPathParams = pathParams.length > 0;
  const isGet = method.toLowerCase() === 'get';

  // 生成参数接口
  const paramsInterface = `/** ${title} - 请求参数 */
export interface I${interfaceName}Params ${params}`;

  // 生成响应接口
  const responseInterface = `/** ${title} - 响应数据 */
export interface I${interfaceName}Response ${response}`;

  // 生成函数实现
  let functionImpl: string;
  if (hasPathParams) {
    // 替换路径中的参数格式，从 {param} 变为 ${param}
    const urlPath = path.replace(/{/g, '${');

    functionImpl = `/** ${title} ${method} ${path} */
export async function ${functionName}(params: I${interfaceName}Params): Promise<I${interfaceName}Response> {
  const { ${pathParams.join(', ')}, ...restParams } = params;
  return request<I${interfaceName}Response>(\`${urlPath}\`, {
    method: '${method}',
    headers: {
      'Content-Type': 'application/json'
    },
    ${isGet ? 'params: restParams' : 'data: restParams'}
  });
}`;
  } else {
    functionImpl = `/** ${title} ${method} ${path} */
export async function ${functionName}(params: I${interfaceName}Params): Promise<I${interfaceName}Response> {
  return request<I${interfaceName}Response>('${path}', {
    method: '${method}',
    headers: {
      'Content-Type': 'application/json'
    },
    ${isGet ? 'params: params' : 'data: params'}
  });
}`;
  }

  return [paramsInterface, responseInterface, functionImpl].join('\n\n');
}

export function generateCode(apis: ParsedApiData[], requestImportPath: string = '@/utils/request'): string {
  // 过滤出支持的 HTTP 方法
  const supportedMethods = ['get', 'post', 'put', 'delete'];
  const filteredApis = apis.filter(api => 
    supportedMethods.includes(api.method.toLowerCase())
  );

  const imports = `import { request } from '${requestImportPath}';`;
  const interfaces = filteredApis.map(generateInterface).join('\n\n');

  return `${imports}\n\n${interfaces}`;
}

export function saveToFile(code: string, outputPath: string): void {
  try {
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, code);
    console.log('API interface generated successfully:', outputPath);
  } catch (error) {
    console.error('Error saving file:', error);
  }
}
