import fs from 'fs';
import prettier from "prettier";

/**
 * 格式化 JSON 生成的代码
 * @param code 要格式化的代码字符串
 * @returns 格式化后的代码
 */
export async function formatCode(code: string): Promise<string> {
  try {
    return await prettier.format(code, {
      parser: "typescript",
      semi: true,
      singleQuote: true,
      trailingComma: "all",
      tabWidth: 2,
    });
  } catch (error) {
    console.error("代码格式化失败:", error);
    return code; // 如果格式化失败，返回原始代码
  }
}

// // 示例用法
// const jsonGeneratedCode = `const data = {"name":"John","age":30,"city":"New York"};`;
// console.log(formatCode(jsonGeneratedCode));

export function readJsonFile(filePath: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}
