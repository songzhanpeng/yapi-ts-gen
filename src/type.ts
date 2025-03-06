export interface ApiType {
    path: string;
    method: string;
    description?: string;
    parameters?: any[];
    responses?: any;
}
