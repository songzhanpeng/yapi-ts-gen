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
    // Output file name
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
    "yapiBaseUrl": "http://your-yapi-domain"
  }
];

module.exports = config;
```

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
创建配置文件 `yapi.config.js`：
```javascript
const config = [
  {
    // YApi 导出地址
    "yapiUrl": "http://your-yapi-domain/api/open/plugin/export-full?type=json&pid=your-project-id&status=all&token=your-token",
    // 生成文件的输出目录
    "outputDir": "./src/api",
    // 输出文件名
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
    "yapiBaseUrl": "http://your-yapi-domain"
  }
];

module.exports = config;
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

### 许可证
MIT
