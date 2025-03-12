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
        const data = response.data;

        // 从 URL 中提取 YAPI 相关信息
        const urlObj = new URL(url);
        const yapiBaseUrl = `${urlObj.protocol}//${urlObj.host}`;
        
        // 处理数据，添加 YAPI 相关信息
        const processYapiData = (item: any) => {
            if (!item) return item;
            const result = {
                ...item,
                yapiBaseUrl,
                project_id: item.project_id,
                _id: item._id
            };
            // 如果有嵌套的 list，也处理它
            if (result.list && Array.isArray(result.list)) {
                result.list = result.list.map(processYapiData);
            }
            return result;
        };

        // 处理数据
        let processedData;
        if (Array.isArray(data)) {
            // 处理数组
            processedData = data.map(processYapiData);
        } else {
            // 处理单个对象
            processedData = processYapiData(data);
        }

        // saveJsonToFile(processedData, saveDir, fileName);
        return processedData;
    } catch (error) {
        throw new Error(`Failed to download API JSON: ${(error as Error).message}`);
    }
}
