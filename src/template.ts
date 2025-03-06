export interface CodeTemplate {
  // 文件级别的模板
  fileTemplate: string;
  // 单个接口的模板
  interfaceTemplate: string;
  // 参数格式化函数
  formatParams?: (params: any) => string;
  // 响应格式化函数
  formatResponse?: (response: any) => string;
}

export interface ApiConfig {
    yapiUrl: string;
    outputDir: string;
    outputFileName: string;
    namespace?: string;
    template?: Partial<CodeTemplate>;
}

// 默认模板配置
export const defaultTemplate: CodeTemplate = {
  fileTemplate: `import { request } from '@/utils/request';

{{interfaces}}
`,

  interfaceTemplate: `
/** {{title}} - 请求参数 */
export interface I{{interfaceName}}Params {
{{params}}
}

/** {{title}} - 响应数据 */
export interface I{{interfaceName}}Response {{response}}

/** {{title}} {{method}} {{path}} */
export async function {{functionName}}(params: I{{interfaceName}}Params): Promise<I{{interfaceName}}Response> {
  return request<I{{interfaceName}}Response>(\`{{path}}\`, {
    method: '{{method}}',
    headers: {
      'Content-Type': 'application/json'
    },
    {{requestType}}: params
  });
}`,

  formatParams: (params: any) => {
    if (!params || typeof params !== 'object') return '{}';
    return Object.entries(params)
      .map(([key, value]: [string, any]) => `  ${key}: ${value.type || 'string'};`)
      .join('\n');
  },

  formatResponse: (response: any) => {
    if (!response || typeof response !== 'object') return '{}';
    return JSON.stringify(response, null, 2);
  }
}; 