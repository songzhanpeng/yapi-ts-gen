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
      if (!schema.properties) return "Record<string, any>";

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
          return `${indent}${key}${!isRequired || isNullable ? "?" : ""}: ${type};${description}`;
        })
        .join("\n");

      return `{\n${properties}\n${indent}}`;

    case "array":
      if (!schema.items) return "any[]";
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
        const types = schema.type.map((t) =>
          t === "null" ? "null" : parseJsonSchema({ type: t }, level)
        );
        return types.join(" | ");
      }
      return "any";
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
  if (word.includes("_")) {
    return word
      .split("_")
      .map((w, index) =>
        index === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join("");
  }
  return word;
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

      // 只在函数名中使用格式化的参数名
      const formattedParam = replaceWord(paramName);
      paramsName +=
        "By" + formattedParam.charAt(0).toUpperCase() + formattedParam.slice(1);
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
    functionName = method.toLowerCase() + functionName;
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
  };
}
