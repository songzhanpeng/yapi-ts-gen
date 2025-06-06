export interface ParsedApiData {
  functionName: string;
  interfaceName: string;
  title: string;
  method: string;
  path: string;
  params: string;
  response: string;
  pathParams: string[];
  yapiBaseUrl?: string;
  projectId?: number;
  apiId?: number;
  hasRequiredParams?: boolean; // Flag to indicate if the params have any required fields
}

// 解析 JSON Schema 为 TypeScript 类型
type JsonSchema = {
  type: string | string[];
  properties?: { [key: string]: JsonSchema };
  items?: JsonSchema;
  required?: string[];
  description?: string;
};

export function parseJsonSchema(schema: JsonSchema | null, level = 0): string {
  if (!schema) return "{}";

  const indent = "  ".repeat(level);

  switch (schema.type) {
    case "object":
      if (!schema.properties || Object.keys(schema.properties).length === 0) {
        // 返回 "{}" 代替 "Record<string, never>"，避免语法错误
        return "{}";
      }

      const properties = Object.entries(schema.properties)
        .map(([key, value]) => {
          const type = parseJsonSchema(value, level + 1);
          const isRequired = schema.required?.includes(key);
          // 处理可能为null的字段
          const isNullable =
            value.type === "null" ||
            (Array.isArray(value.type) && value.type.includes("null"));
          const description = value.description
            ? ` // ${value.description}`
            : "";
          
          // 处理特殊键名 (检查键名是否包含空格或其他需要转义的特殊字符)
          const needsQuotes = /[\s\-\+\!\@\#\$\%\^\&\*\(\)\[\]\{\}\;\:\'\"\,\.\<\>\/\\\?]/.test(key);
          const formattedKey = needsQuotes ? `"${key}"` : key;
          
          return `${indent}${formattedKey}${!isRequired || isNullable ? "?" : ""}: ${type};${description}`;
        })
        .join("\n");

      return `{\n${properties}\n${indent}}`;

    case "array":
      if (!schema.items) return "unknown[]";
      const itemType = parseJsonSchema(schema.items, level);
      return `${itemType}[]`;

    case "string":
      return "string";

    case "number":
    case "integer":
      return "number";

    case "boolean":
      return "boolean";

    case "null":
      return "null";

    default:
      if (Array.isArray(schema.type)) {
        // 处理联合类型
        const types = schema.type
          .filter(t => t !== "null") // Handle null separately
          .map(t => parseJsonSchema({ type: t }, level));
        
        const baseType = types.join(" | ");
        
        // Add null to union type if one of the types was null
        if (schema.type.includes("null")) {
          return `${baseType} | null`;
        }
        
        return baseType;
      }
      return "unknown"; // Use unknown instead of any for better type safety
  }
}

function matchPath(path: string, stripPathPrefixes: string[]): string | null {
  if (!stripPathPrefixes?.length) return path;

  for (const prefix of stripPathPrefixes) {
    const pattern = new RegExp(`^/?${prefix}/?`);
    if (pattern.test(path)) {
      return path.replace(pattern, '');
    }
  }
  return path;
}

const replaceWord = (word: string) => {
  return word
    .split(/[^a-zA-Z0-9]+/) // 匹配非字母数字、{、-的分隔符
    .filter(Boolean) // 过滤空字符串（防止多个分隔符连续）
    .map((w, index) =>
      index === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
};


export function extractNameAndParams(
  path: string,
  method: string,
  stripPathPrefixes?: string[]
): ParsedApiData {
  const newPath = matchPath(path, stripPathPrefixes || []);
  if (!newPath) {
    return {
      functionName: "",
      interfaceName: "",
      title: "",
      method: "",
      path: "",
      params: "{}",
      response: "{}",
      pathParams: [],
      hasRequiredParams: false,
    };
  }

  // Remove leading slash and split the path into parts
  const parts = newPath.replace(/^\//, "").split("/");
  const pathParams: string[] = [];
  let baseName = "";
  let paramsName = "";

  // Process each part of the path
  parts.forEach((part) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      // It's a path parameter, process it
      const paramName = part.slice(1, -1); // Remove the curly braces
      // 保持原始参数名称
      pathParams.push(paramName);

      // 修改这里，保持参数名中的大小写
      // 如果参数名本身是驼峰式的（如userId, orgId），要保持原样
      // 如果是下划线分隔的，将其转为驼峰式
      let formattedParam = paramName;
      
      // 如果参数名包含下划线，将其转为驼峰式
      if (paramName.includes('_')) {
        formattedParam = paramName.split('_')
          .map((part, index) => 
            index === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          )
          .join('');
      }
      
      // 确保每个单词的首字母都是大写的（针对 By 后面的部分）
      // 尊重已有的驼峰命名法
      const camelCaseName = formattedParam.replace(/([a-z])([A-Z])/g, '$1$2');
      
      paramsName +=
        "By" + camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);
    } else {
      // It's a normal path segment, convert to camel case and add it
      const formattedPart = replaceWord(part);
      baseName +=
        formattedPart.charAt(0).toUpperCase() + formattedPart.slice(1);
    }
  });

  let functionName = baseName + paramsName;

  if (!functionName.toLowerCase().includes(method.toLowerCase())) {
    // Add method prefix to function name
    functionName = method.toLowerCase() + baseName + paramsName;
  } else {
    functionName = functionName.charAt(0).toLowerCase() + functionName.slice(1);
  }

  // The interface name should be in PascalCase (first letter uppercase)
  const interfaceName =
    functionName.charAt(0).toUpperCase() + functionName.slice(1);

  return {
    functionName,
    interfaceName,
    title: "",
    method,
    path,
    params: "{}",
    response: "{}",
    pathParams,
    hasRequiredParams: pathParams.length > 0, // Path params are always required
  };
}
