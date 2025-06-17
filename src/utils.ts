import fs from 'fs';
import prettier from "prettier";
import { YapiRequestHeader } from './types';
// Import fabric configuration
const fabric = require('@umijs/fabric');

/**
 * 格式化 JSON 生成的代码
 * @param code 要格式化的代码字符串
 * @returns 格式化后的代码
 */
export async function formatCode(code: string): Promise<string> {
  try {
    const options = {
      ...fabric.prettier,
      parser: "typescript",
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: "as-needed",
      jsxSingleQuote: false,
      trailingComma: "all",
      bracketSpacing: true,
      arrowParens: "avoid",
      endOfLine: "lf",
    };
    
    return await prettier.format(code, options);
  } catch (error) {
    console.error("代码格式化失败:", error);
    return code; // 如果格式化失败，返回原始代码
  }
}

/**
 * 根据 req_headers 生成动态 headers 对象代码
 * @param reqHeaders YApi 接口的 req_headers 数组
 * @returns 生成的 headers 对象代码字符串
 */
export function generateHeaders(reqHeaders?: YapiRequestHeader[]): string {
  if (!reqHeaders || reqHeaders.length === 0) {
    return `{
      'Content-Type': 'application/json',
    }`;
  }

  const headers: string[] = [];
  
  // 遍历 req_headers 数组，生成对应的 header 项
  reqHeaders.forEach(header => {
    const { name, value, required } = header;
    
    // 如果有值就添加到 headers 中
    if (value && value.trim()) {
      // 处理特殊的 header 名称，如果包含特殊字符则用引号包围
      const headerName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `'${name}'`;
      headers.push(`      ${headerName}: '${value}',`);
    } else if (required === '1') {
      // 如果是必需的但没有默认值，添加注释提示
      const headerName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `'${name}'`;
      headers.push(`      // ${headerName}: '', // 必需字段，请根据实际情况设置`);
    }
  });

  // 如果没有 Content-Type 且不是 multipart/form-data，默认添加 application/json
  const hasContentType = reqHeaders.some(header => 
    header.name.toLowerCase() === 'content-type'
  );
  
  if (!hasContentType) {
    headers.unshift(`      'Content-Type': 'application/json',`);
  }

  return `{\n${headers.join('\n')}\n    }`;
}

/**
 * 创建一个包含动态headers的示例API函数
 * @param functionName 函数名称
 * @param method HTTP方法
 * @param path API路径
 * @param reqHeaders 请求头数组
 * @returns 生成的API函数代码
 */
export function createApiFunction(
  functionName: string,
  method: string,
  path: string,
  reqHeaders?: YapiRequestHeader[]
): string {
  const headersCode = generateHeaders(reqHeaders);
  const isGet = method.toLowerCase() === 'get';
  
  return `/** ${functionName} - 请求参数 */
export interface I${functionName.charAt(0).toUpperCase() + functionName.slice(1)}Params {}

/** ${functionName} - 响应数据 */
export interface I${functionName.charAt(0).toUpperCase() + functionName.slice(1)}Response {}

/** ${functionName} ${method} ${path} */
export async function ${functionName}(
  params?: I${functionName.charAt(0).toUpperCase() + functionName.slice(1)}Params,
): Promise<I${functionName.charAt(0).toUpperCase() + functionName.slice(1)}Response> {
  return request<I${functionName.charAt(0).toUpperCase() + functionName.slice(1)}Response>('${path}', {
    method: '${method}',
    headers: ${headersCode},
    ${isGet ? 'params: params || {}' : 'data: params || {}'}
  });
}`;
}

// // 示例用法
// const jsonGeneratedCode = `const data = {"name":"John","age":30,"city":"New York"};`;
// console.log(formatCode(jsonGeneratedCode));

export function readJsonFile(filePath: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}
