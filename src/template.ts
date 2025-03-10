export interface CodeTemplate {
  // 文件级别的模板
  fileTemplate: string;
  // 单个接口的模板
  interfaceTemplate: string;
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
export interface I{{interfaceName}}Params {{params}}

/** {{title}} - 响应数据 */
export interface I{{interfaceName}}Response {{response}}

/** {{title}} {{method}} {{path}} */
export async function {{functionName}}(params: I{{interfaceName}}Params): Promise<I{{interfaceName}}Response> {
  {{#if hasPathParams}}
  const { {{pathParams}}, ...restParams } = params;
  return request<I{{interfaceName}}Response>(\`{{path}}\`, {
    method: '{{method}}',
    headers: {
      'Content-Type': 'application/json'
    },
    {{#if isGet}}
    params: restParams
    {{else}}
    data: restParams
    {{/if}}
  });
  {{else}}
  return request<I{{interfaceName}}Response>('{{path}}', {
    method: '{{method}}',
    headers: {
      'Content-Type': 'application/json'
    },
    {{#if isGet}}
    params: params
    {{else}}
    data: params
    {{/if}}
  });
  {{/if}}
}`
}; 