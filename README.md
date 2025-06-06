# yapi-ts-gen

[English](#english) | [中文](#chinese)

## English

### Introduction
yapi-ts-gen is a TypeScript code generator for YApi. It helps developers automatically generate TypeScript interface definitions and API request functions based on YApi documentation.

### Features
- Generate TypeScript interface definitions from YApi
- Generate API request functions with proper parameter handling
- Support for custom request functions
- Type-safe API calls
- Smart detection of optional parameters
- Clean and consistent code formatting
- **NEW**: Support for custom output rules - group multiple APIs into the same file based on path matching

### Installation
```bash
npm install yapi-ts-gen --save-dev
# or
yarn add yapi-ts-gen -D
```

### Usage
1. Initialize the configuration file:
```bash
npx yapi-ts-gen -i
```

2. Configure your YApi project information in `yapi.config.js`

3. Generate TypeScript code:
```bash
npx yapi-ts-gen -g
```

### Configuration
Create a configuration file `yapi.config.js`:
```javascript
const config = [
  {
    // YApi export URL
    "yapiUrl": "http://your-yapi-domain/api/open/plugin/export-full?type=json&pid=your-project-id&status=all&token=your-token",
    // Output directory for generated files
    "outputDir": "./src/api",
    // Default output file name (for APIs that don't match custom output rules)
    "outputFileName": "api.ts",
    // Namespace for generated code
    "namespace": "API",
    // Path prefixes to remove from API endpoints
    "stripPathPrefixes": [
      "api",
      "v1",
      "v2"
    ],
    // Import path for request utility
    "requestImportPath": "@/utils/request",
    // Base URL for YApi documentation links in comments
    "yapiBaseUrl": "http://your-yapi-domain",
    
    // NEW: Custom output rules - group APIs into specific files based on path matching
    "customOutputs": [
      {
        "matches": ["/api/user", "/api/auth"], // APIs starting with these paths
        "outputFileName": "user.ts"           // will be output to this file
      },
      {
        "matches": ["/api/product", "/api/order"],
        "outputFileName": "business.ts"
      }
    ]
  }
];

module.exports = config;
```

#### 自定义输出规则
`customOutputs` 功能允许您根据路径模式将生成的 API 函数组织到多个文件中：

- **matches**: 用于匹配 API 路径的前缀数组  
- **outputFileName**: 匹配的接口输出到的目标文件名
- 不匹配任何自定义规则的接口将放置在默认的 `outputFileName` 中

示例：
- 路径以 `/api/user` 或 `/api/auth` 开头的接口 → `user.ts`
- 路径以 `/api/product` 或 `/api/order` 开头的接口 → `business.ts`  
- 其他接口 → `api.ts` (默认文件)

### Generated Code Example
The generated code will include TypeScript interfaces and functions like this:
```typescript
/** Get user information - Request params */
export interface IGetUserByIdParams {
  id: string; // Path parameter
  include?: string; // Optional query parameter
}

/** Get user information - Response data */
export interface IGetUserByIdResponse {
  id: string;
  name: string;
  email?: string;
}

/** @see http://your-yapi-domain/project/123/interface/api/456 */
/** Get user information GET /api/users/{id} */
export async function getUserById(
  params: IGetUserByIdParams,
): Promise<IGetUserByIdResponse> {
  const { id, ...restParams } = params;
  return request<IGetUserByIdResponse>(`/api/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: restParams,
  });
}
```

### License
MIT

---

## Chinese

### 简介
yapi-ts-gen 是一个基于 YApi 的 TypeScript 代码生成器。它可以帮助开发者根据 YApi 文档自动生成 TypeScript 接口定义和 API 请求函数。

### 特性
- 从 YApi 生成 TypeScript 接口定义
- 生成带有适当参数处理的 API 请求函数
- 支持自定义请求函数
- 类型安全的 API 调用
- 智能检测可选参数
- 清晰一致的代码格式  
- **新功能**: 支持自定义输出规则 - 根据路径匹配将多个接口分组到同一个文件

### 安装
```bash
npm install yapi-ts-gen --save-dev
# 或者
yarn add yapi-ts-gen -D
```

### 使用方法
1. 初始化配置文件：
```bash
npx yapi-ts-gen -i
```

2. 在 `yapi.config.js` 中配置你的 YApi 项目信息

3. 生成 TypeScript 代码：
```bash
npx yapi-ts-gen -g
```

### 配置
创建配置文件 `yapi.config.js`:
```javascript
const config = [
  {
    // YApi 导出地址
    "yapiUrl": "http://your-yapi-domain/api/open/plugin/export-full?type=json&pid=your-project-id&status=all&token=your-token",
    // 生成文件的输出目录
    "outputDir": "./src/api",
    // 默认输出文件名（不匹配自定义输出规则的接口将输出到此文件）
    "outputFileName": "api.ts",
    // 生成代码的命名空间
    "namespace": "API",
    // 需要从 API 路径中移除的前缀
    "stripPathPrefixes": [
      "api",
      "v1",
      "v2"
    ],
    // 请求工具的导入路径
    "requestImportPath": "@/utils/request",
        // YApi 文档链接的基础 URL（用于注释中）
    "yapiBaseUrl": "http://your-yapi-domain",
     
    // 新功能：自定义输出规则 - 根据路径匹配将接口分组到指定文件
    "customOutputs": [
      {
        "matches": ["/api/user", "/api/auth"], // 以这些路径开头的接口
        "outputFileName": "user.ts"           // 将输出到此文件
      },
      {
        "matches": ["/api/product", "/api/order"],
        "outputFileName": "business.ts"
      }
    ]
  }
];

module.exports = config;
```

#### Custom Output Rules
The `customOutputs` feature allows you to organize your generated API functions into multiple files based on path patterns:

- **matches**: Array of path prefixes to match against API paths
- **outputFileName**: Target file name for matched APIs
- APIs that don't match any custom rules will be placed in the default `outputFileName`

Example:
- APIs with paths starting with `/api/user` or `/api/auth` → `user.ts`
- APIs with paths starting with `/api/product` or `/api/order` → `business.ts`  
- Other APIs → `api.ts` (default file)

#### 使用自定义输出规则
当你配置了 `customOutputs` 规则后，代码生成器会：

1. **分析每个接口的路径**：检查接口路径是否匹配任何自定义规则
2. **分组输出**：将匹配的接口输出到对应的文件中
3. **默认处理**：将不匹配任何规则的接口输出到默认文件

生成过程控制台输出示例：
```
Generated 15 interfaces to feature.ts
Generated 8 interfaces to statistics.ts  
Generated 12 interfaces to index.ts (default)
```

### 生成代码示例
生成的代码将包含 TypeScript 接口和函数，如下所示：
```typescript
/** 获取用户信息 - 请求参数 */
export interface IGetUserByIdParams {
  id: string; // 路径参数
  include?: string; // 可选查询参数
}

/** 获取用户信息 - 响应数据 */
export interface IGetUserByIdResponse {
  id: string;
  name: string;
  email?: string;
}

/** @see http://your-yapi-domain/project/123/interface/api/456 */
/** 获取用户信息 GET /api/users/{id} */
export async function getUserById(
  params: IGetUserByIdParams,
): Promise<IGetUserByIdResponse> {
  const { id, ...restParams } = params;
  return request<IGetUserByIdResponse>(`/api/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: restParams,
  });
}
```

## 更新日志

### v1.1.0 - 2024-12-19
- **新增功能**: 支持自定义输出规则 (`customOutputs`)
  - 可以根据接口路径前缀将多个接口分组到同一个文件
  - 支持多个匹配规则，每个规则可以指定不同的输出文件
  - 不匹配任何规则的接口仍然输出到默认文件
  - 提供详细的控制台输出，显示每个文件生成的接口数量

### 许可证
MIT
