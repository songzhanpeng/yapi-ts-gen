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
    params: template.formatParams ? template.formatParams(apiData.params) : JSON.stringify(apiData.params, null, 2),
    response: template.formatResponse ? template.formatResponse(apiData.response) : JSON.stringify(apiData.response, null, 2),
    requestType: apiData.method.toLowerCase() === 'get' ? 'params' : 'data'
  };

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
