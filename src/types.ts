export interface CodeTemplate {
    // 文件级别的模板
    fileTemplate: string;
    // 单个接口的模板
    interfaceTemplate: string;
}

// 新增：自定义输出规则接口
export interface CustomOutputRule {
    matches: string[]; // 匹配的路径前缀数组
    outputFileName: string; // 输出文件名
}

export interface ApiConfig {
    yapiUrl: string;
    outputDir: string;
    outputFileName: string;
    namespace?: string;
    template?: Partial<CodeTemplate>;
    stripPathPrefixes?: string[];
    requestImportPath?: string;
    yapiBaseUrl?: string; // Base URL for YAPI documentation links
    // 新增：自定义输出规则，用于将匹配的接口输出到指定文件
    customOutputs?: CustomOutputRule[];
}


export interface YapiQueryParam {
    name: string;
    type?: string;
    required: string;
    desc?: string;
}

export interface YapiApiData {
    path: string;
    method: string;
    title: string;
    req_query?: YapiQueryParam[];
    req_body_other?: string;
    res_body_type?: string;
    res_body?: string;
    yapiBaseUrl?: string;
    projectId?: number;
    apiId?: number;
    project_id?: number; // Alternative name for projectId
    _id?: number; // Alternative name for apiId
}

export interface YapiCategory {
    list: YapiApiData[];
}

export interface ApiType {
    path: string;
    method: string;
    description?: string;
    parameters?: any[];
    responses?: any;
}
