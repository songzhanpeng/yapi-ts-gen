# YApi TypeScript Generator (YApi TS Gen)

A powerful TypeScript code generator that automatically creates type definitions and API client code from YApi documentation.

[English](#english) | [中文](#chinese)

## English

### Overview

YApi TS Gen is a tool that automatically generates TypeScript interfaces and API client code from YApi documentation. It helps maintain type safety and reduces the manual work needed to keep API client code in sync with your API documentation.

### Features

- 🚀 Automatic TypeScript interface generation from YApi JSON schema
- 💪 Type-safe API client code generation
- 🔄 Support for multiple API endpoints
- ⚡ Fast and efficient processing
- 🛠️ Customizable code templates

### Installation

```bash
npm install yapi-ts-gen
```

### Usage

1. Configure your YApi endpoints in `src/config.ts`
2. Run the generator:

```bash
npm run build
npm start
```

Or for development:

```bash
npm run dev
```

### Configuration

Configure your API endpoints in `src/config.ts`. Example configuration:

```typescript
export const defaultConfig: ApiConfig[] = [
  {
    yapiUrl: "your-yapi-url",
    outputDir: "./generated",
    outputFileName: "api.ts"
  }
];
```

### Project Structure

```
├── src
│   ├── config.ts          // Configuration file
│   ├── fetcher.ts         // YApi data downloader
│   ├── parser.ts          // API JSON parser
│   ├── generator.ts       // Code generation logic
│   └── index.ts          // Main program entry
├── dist                   // TypeScript compiled output
├── tsconfig.json         // TypeScript configuration
└── package.json         // Project dependencies
```

---

## Chinese

### 概述

YApi TS Gen 是一个自动从 YApi 文档生成 TypeScript 接口和 API 客户端代码的工具。它有助于维护类型安全性，并减少保持 API 客户端代码与 API 文档同步所需的手动工作。

### 特性

- 🚀 自动从 YApi JSON schema 生成 TypeScript 接口
- 💪 类型安全的 API 客户端代码生成
- 🔄 支持多个 API 端点
- ⚡ 快速高效的处理
- 🛠️ 可自定义的代码模板

### 安装

```bash
npm install yapi-ts-gen
```

### 使用方法

1. 在 `src/config.ts` 中配置你的 YApi 端点
2. 运行生成器：

```bash
npm run build
npm start
```

开发模式：

```bash
npm run dev
```

### 配置

在 `src/config.ts` 中配置你的 API 端点。配置示例：

```typescript
export const defaultConfig: ApiConfig[] = [
  {
    yapiUrl: "你的-yapi-url",
    outputDir: "./generated",
    outputFileName: "api.ts"
  }
];
```

### 项目结构

```
├── src
│   ├── config.ts          // 配置文件
│   ├── fetcher.ts         // YApi 数据下载器
│   ├── parser.ts          // API JSON 解析器
│   ├── generator.ts       // 代码生成逻辑
│   └── index.ts          // 主程序入口
├── dist                   // TypeScript 编译输出
├── tsconfig.json         // TypeScript 配置
└── package.json         // 项目依赖
```

## License

MIT