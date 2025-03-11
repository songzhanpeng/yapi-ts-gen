# YAPI TypeScript API Generator

A TypeScript API client generator for YAPI.

## Installation

```bash
npm install -g yapi-ts-gen
```

## Usage

1. Initialize the configuration file:

```bash
yapi-ts-gen --init
```

This will create a `yapi.config.ts` file in your current directory with the following content:

```typescript
import { ApiConfig } from 'yapi-ts-gen';

const config: ApiConfig[] = [
  {
    yapiUrl: 'http://your-yapi-domain/api/open/plugin/export-full?type=json&pid=your-project-id&status=all&token=your-token',
    outputDir: './src/api',
    outputFileName: 'api.ts',
    namespace: 'API'
  }
];

export default config;
```

2. Update the configuration file with your YAPI settings:
   - `yapiUrl`: Your YAPI export URL
   - `outputDir`: Directory where the generated API client will be saved
   - `outputFileName`: Name of the generated API client file
   - `namespace`: Optional namespace for the generated API client

3. Generate the API client:

```bash
yapi-ts-gen --generate
```

## Configuration Options

The configuration file supports the following options:

```typescript
interface ApiConfig {
  yapiUrl: string;      // YAPI export URL
  outputDir: string;    // Output directory
  outputFileName: string; // Output file name
  namespace?: string;   // Optional namespace
}
```

## Features

- Generates TypeScript API client from YAPI
- Supports multiple API configurations
- Generates TypeScript interfaces for request and response types
- Supports path parameters, query parameters, and request body
- Formats generated code with Prettier
- CLI support for easy integration

## License

MIT