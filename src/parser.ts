export interface ParsedApiData {
    functionName: string;
    interfaceName: string;
    title: string;
    method: string;
    path: string;
    params: string;
    response: string;
  }
  
  // 解析 API JSON，生成接口定义
  export function parseJsonSchema(schema: any): string {
    if (!schema || !schema.type) return '{}';
  
    switch (schema.type) {
      case 'object':
        if (!schema.properties) return 'Record<string, any>';
        return `{
          ${Object.entries(schema.properties)
            .map(([key, value]) => `${key}: ${parseJsonSchema(value)};`)
            .join('\n')}
        }`;
      case 'array':
        return `${parseJsonSchema(schema.items)}[]`;
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      default:
        return '{}';
    }
  }
  
  // 提取接口名称和路径参数
  export function extractNameAndParams(path: string, method: string): ParsedApiData {
    // 移除开头的斜杠并分割路径
    const parts = path.replace(/^\//, '').split('/');
    
    // 收集路径参数和非路径参数部分
    const pathParams: string[] = [];
    const nonPathParts: string[] = [];
    
    // 过滤掉不需要的部分（api, v1等）并收集有效部分
    parts.forEach(part => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const paramName = part.slice(1, -1);
        pathParams.push(paramName);
      } else if (!part.match(/^(api)$/i) && !part.match(/^v\d+$/)) {
        // 跳过 api 和版本号
        nonPathParts.push(part);
      }
    });

    // 生成函数名
    let functionName = '';
    
    // 处理资源名称部分
    if (nonPathParts.length > 0) {
      // 将所有部分转换为驼峰命名
      const nameParts = nonPathParts.map(part => {
        // 移除查询参数部分
        const cleanPart = part.split('?')[0];
        // 转换为驼峰命名
        return cleanPart.split('_')
          .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join('');
      });

      // 组合函数名
      functionName = nameParts.map((part, index) => 
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      ).join('');
    }

    // 添加 HTTP 方法前缀
    if (!functionName.toLowerCase().includes(method.toLowerCase())) {
      functionName = method.toLowerCase() + functionName.charAt(0).toUpperCase() + functionName.slice(1);
    }

    // 生成接口名称（大驼峰）
    const interfaceName = functionName.charAt(0).toUpperCase() + functionName.slice(1);

    return {
      functionName,
      interfaceName,
      title: '',
      method,
      path,
      params: '{}',
      response: '{}'
    };
  }
  