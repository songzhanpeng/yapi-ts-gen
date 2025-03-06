import axios from 'axios';
import fs from 'fs';
import path from 'path';

// 获取当前时间，并格式化为 年/月/日/时-分
function getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
}

// 创建目录并保存文件
function saveJsonToFile(data: any, baseDir: string, fileName: string) {
    const timestampPath = getTimestamp(); // 生成目录结构
    const dirPath = path.join(baseDir, timestampPath);
    const filePath = path.join(dirPath, `${fileName}.json`);

    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    console.log(`API JSON saved to: ${filePath}`);
}

export async function downloadApiJson(url: string, saveDir: string, fileName: string): Promise<any> {
    try {
        const response = await axios.get(url);
        saveJsonToFile(response.data, saveDir, fileName);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to download API JSON: ${(error as Error).message}`);
    }
}
