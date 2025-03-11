import { ApiConfig, CodeTemplate } from './types';

export type { ApiConfig };

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

export const defaultConfigTemplate: ApiConfig[] = [
  {
    yapiUrl: 'http://your-yapi-domain/api/open/plugin/export-full?type=json&pid=your-project-id&status=all&token=your-token',
    outputDir: './src/api',
    outputFileName: 'api.ts',
    namespace: 'API'
  }
];

export const configFileContent = `const { ApiConfig } = require('yapi-ts-gen');

const config = ${JSON.stringify(defaultConfigTemplate, null, 2)};

module.exports = config;
`; 