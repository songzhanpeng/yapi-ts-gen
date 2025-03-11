export interface CodeTemplate {
    // 文件级别的模板
    fileTemplate: string;
    // 单个接口的模板
    interfaceTemplate: string;
}

export interface ApiConfig {
    yapiUrl: string;
    outputDir: string;
    outputFileName: string;
    namespace?: string;
    template?: Partial<CodeTemplate>;
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
