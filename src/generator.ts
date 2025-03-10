import { ParsedApiData } from './parser';
import { CodeTemplate, defaultTemplate } from './template';
import fs from 'fs';

function replaceTemplateVars(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || '');
}

export function generateSingleInterface(
  apiData: ParsedApiData,
  template: CodeTemplate = defaultTemplate
): string {
  const vars = {
    title: apiData.title || '',
    interfaceName: apiData.interfaceName,
    functionName: apiData.functionName,
    method: apiData.method,
    path: apiData.path,
    params: "",
    response: apiData.response,
    requestType: apiData.method.toLowerCase() === 'get' ? 'params' : 'data'
  };

  console.log("vars", vars);

  return replaceTemplateVars(template.interfaceTemplate, vars);
}

export function generateCode(
  apis: ParsedApiData[],
  template: CodeTemplate = defaultTemplate
): string {
  const interfaces = apis
    .map(api => generateSingleInterface(api, template))
    .join('\n\n');

  return replaceTemplateVars(template.fileTemplate, { interfaces });
}

export function saveToFile(code: string, outputPath: string): void {
  try {
    fs.writeFileSync(outputPath, code);
    console.log('API interface generated successfully:', outputPath);
  } catch (error) {
    console.error('Error saving file:', error);
  }
}
