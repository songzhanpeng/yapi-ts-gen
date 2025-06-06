import { request } from '@/utils/request';

/** 导入数据接口 - 请求参数 */
export interface IPostApiTraceMatrixResourceuseUploadParams {}

/** 导入数据接口 - 响应数据 */
export interface IPostApiTraceMatrixResourceuseUploadResponse {
  error?: number;
  message?: string;
  data?: string;
}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11907 */
/** 导入数据接口 POST /api/trace_matrix/resourceuse-upload */
export async function postApiTraceMatrixResourceuseUpload(
  params?: IPostApiTraceMatrixResourceuseUploadParams,
): Promise<IPostApiTraceMatrixResourceuseUploadResponse> {
  return request<IPostApiTraceMatrixResourceuseUploadResponse>(
    '/api/trace_matrix/resourceuse-upload',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params || {},
    },
  );
}

/** 导出数据接口 - 请求参数 */
export interface IPostApiTraceMatrixResourceuseExportParams {
  startDate: string;
  endDate: string;
}

/** 导出数据接口 - 响应数据 */
export interface IPostApiTraceMatrixResourceuseExportResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11910 */
/** 导出数据接口 POST /api/trace_matrix/resourceuse-export */
export async function postApiTraceMatrixResourceuseExport(
  params: IPostApiTraceMatrixResourceuseExportParams,
): Promise<IPostApiTraceMatrixResourceuseExportResponse> {
  return request<IPostApiTraceMatrixResourceuseExportResponse>(
    '/api/trace_matrix/resourceuse-export',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    },
  );
}

/** 排班接口 - 请求参数 */
export interface IGetApiTraceMatrixNewresourcestandParams {}

/** 排班接口 - 响应数据 */
export interface IGetApiTraceMatrixNewresourcestandResponse {
  error?: number;
  message?: string;
}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11898 */
/** 排班接口 GET /api/trace_matrix/newresourcestand */
export async function getApiTraceMatrixNewresourcestand(
  params?: IGetApiTraceMatrixNewresourcestandParams,
): Promise<IGetApiTraceMatrixNewresourcestandResponse> {
  return request<IGetApiTraceMatrixNewresourcestandResponse>('/api/trace_matrix/newresourcestand', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params || {},
  });
}

/** 测试资源当前使用情况列表 - 请求参数 */
export interface IGetApiTraceMatrixResourceuseParams {}

/** 测试资源当前使用情况列表 - 响应数据 */
export interface IGetApiTraceMatrixResourceuseResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11895 */
/** 测试资源当前使用情况列表 GET /api/trace_matrix/resourceuse */
export async function getApiTraceMatrixResourceuse(
  params?: IGetApiTraceMatrixResourceuseParams,
): Promise<IGetApiTraceMatrixResourceuseResponse> {
  return request<IGetApiTraceMatrixResourceuseResponse>('/api/trace_matrix/resourceuse', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params || {},
  });
}

/** 资源使用图表接口 - 请求参数 */
export interface IPostApiTraceMatrixResourceuseChartfliterParams {
  startDate: string;
  endDate: string;
}

/** 资源使用图表接口 - 响应数据 */
export interface IPostApiTraceMatrixResourceuseChartfliterResponse {
  error?: number;
  message?: string;
  data?: {
    final_result?: {
      stand: string;
      data: {
        labels?: string[];
        pieData?: number[];
        actualValues?: number[];
        subsystemColor?: string[];
        standColor?: string[];
      };
    }[];
    bar_result?: {
      labels?: string[];
      barData?: number[];
      subsystemColor?: string[];
      totalBarData?: number;
    };
    stand_result?: {
      labels?: string[];
      barData?: number[];
      totalBarData?: number;
      standColor?: string[];
    };
  };
}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11892 */
/** 资源使用图表接口 POST /api/trace_matrix/resourceuse-chartfliter */
export async function postApiTraceMatrixResourceuseChartfliter(
  params: IPostApiTraceMatrixResourceuseChartfliterParams,
): Promise<IPostApiTraceMatrixResourceuseChartfliterResponse> {
  return request<IPostApiTraceMatrixResourceuseChartfliterResponse>(
    '/api/trace_matrix/resourceuse-chartfliter',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    },
  );
}

/** 资源列表接口（用户、子系统、台架、本周日期、资源信息） - 请求参数 */
export interface IGetApiTraceMatrixResourcestandParams {}

/** 资源列表接口（用户、子系统、台架、本周日期、资源信息） - 响应数据 */
export interface IGetApiTraceMatrixResourcestandResponse {
  error?: number;
  message?: string;
  data?: {
    users?: {
      id: number;
      name: string;
    }[];
    subsystems?: {
      id: number;
      name: string;
    }[];
    resource_list?: {
      test_id: number;
      stand_id: number;
      subsystem_id: number;
      author_id: number;
      test_date: string;
      test_time: string;
      create_date: string;
      stand_name: string;
      subsystem_name: string;
      user_name: string;
    }[];
    date1?: string;
    date2?: string;
    date3?: string;
    date4?: string;
    date5?: string;
    date6?: string;
    date7?: string;
    stand_info?: {
      all_stand_names?: string[];
      stand_num?: number;
    };
  };
}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11901 */
/** 资源列表接口（用户、子系统、台架、本周日期、资源信息） GET /api/trace_matrix/resourcestand */
export async function getApiTraceMatrixResourcestand(
  params?: IGetApiTraceMatrixResourcestandParams,
): Promise<IGetApiTraceMatrixResourcestandResponse> {
  return request<IGetApiTraceMatrixResourcestandResponse>('/api/trace_matrix/resourcestand', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params || {},
  });
}

/** 资源编辑接口 - 请求参数 */
export interface IPostApiTraceMatrixCreateResourcestandParams {}

/** 资源编辑接口 - 响应数据 */
export interface IPostApiTraceMatrixCreateResourcestandResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11904 */
/** 资源编辑接口 POST /api/trace_matrix/create-resourcestand */
export async function postApiTraceMatrixCreateResourcestand(
  params?: IPostApiTraceMatrixCreateResourcestandParams,
): Promise<IPostApiTraceMatrixCreateResourcestandResponse> {
  return request<IPostApiTraceMatrixCreateResourcestandResponse>(
    '/api/trace_matrix/create-resourcestand',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params || {},
    },
  );
}

/** 资源预约使用率列表接口 - 请求参数 */
export interface IPostApiTraceMatrixResourceusageChartfliterParams {
  startDate: string;
  endDate: string;
}

/** 资源预约使用率列表接口 - 响应数据 */
export interface IPostApiTraceMatrixResourceusageChartfliterResponse {
  error?: number;
  message?: string;
  data?: {
    grouped_resources?: {
      'iAUTO HIL'?: {
        test_id: number;
        stand_id: number;
        subsystem_id: number;
        author_id: number;
        test_date: string;
        test_time: string;
        create_date: string;
        stand_name: string;
        subsystem_name: string;
        user_name: string;
        stand_type: string;
        stand_usage: string;
        is_active: boolean;
      }[];
      'C3 Bench'?: {
        test_id?: number;
        stand_id?: number;
        subsystem_id?: number;
        author_id?: number;
        test_date?: string;
        test_time?: string;
        create_date?: string;
        stand_name?: string;
        subsystem_name?: string;
        user_name?: string;
        stand_type?: string;
        stand_usage?: string;
        is_active?: boolean;
      }[];
      'PCU Standalone'?: {
        stand_name: string;
        stand_type: string;
        stand_usage: string;
        is_active: boolean;
      }[];
      LoadBox?: {
        stand_name: string;
        stand_type: string;
        stand_usage: string;
        is_active: boolean;
      }[];
    };
    test_date?: string;
    test_time?: string;
  };
}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11889 */
/** 资源预约使用率列表接口 POST /api/trace_matrix/resourceusage-chartfliter */
export async function postApiTraceMatrixResourceusageChartfliter(
  params: IPostApiTraceMatrixResourceusageChartfliterParams,
): Promise<IPostApiTraceMatrixResourceusageChartfliterResponse> {
  return request<IPostApiTraceMatrixResourceusageChartfliterResponse>(
    '/api/trace_matrix/resourceusage-chartfliter',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    },
  );
}

/** DeviceUnBinding - 请求参数 */
export interface IPostDeviceunbindingParams {
  pc_name?: string;
  device_name?: string;
  pool_name?: string;
}

/** DeviceUnBinding - 响应数据 */
export interface IPostDeviceunbindingResponse {
  status?: string;
  result?: string;
}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11883 */
/** DeviceUnBinding POST /DeviceUnBinding */
export async function postDeviceunbinding(
  params?: IPostDeviceunbindingParams,
): Promise<IPostDeviceunbindingResponse> {
  return request<IPostDeviceunbindingResponse>('/DeviceUnBinding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params || {},
  });
}

/** DevicesBinding - 请求参数 */
export interface IPostDevicesbindingParams {
  pc_name?: string;
  devices?: {
    device_name: string;
    pool_name: string;
  }[];
}

/** DevicesBinding - 响应数据 */
export interface IPostDevicesbindingResponse {
  status: string;
  result?: string;
}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11880 */
/** DevicesBinding POST /DevicesBinding */
export async function postDevicesbinding(
  params?: IPostDevicesbindingParams,
): Promise<IPostDevicesbindingResponse> {
  return request<IPostDevicesbindingResponse>('/DevicesBinding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params || {},
  });
}

/** GetDevice - 请求参数 */
export interface IGetdeviceParams {}

/** GetDevice - 响应数据 */
export interface IGetdeviceResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11874 */
/** GetDevice GET /GetDevice */
export async function getdevice(params?: IGetdeviceParams): Promise<IGetdeviceResponse> {
  return request<IGetdeviceResponse>('/GetDevice', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params || {},
  });
}

/** GetDevicesInPool - 请求参数 */
export interface IPostGetdevicesinpoolParams {
  status?: string[];
  pool_name?: string[];
}

/** GetDevicesInPool - 响应数据 */
export interface IPostGetdevicesinpoolResponse {
  pool_name: string;
  pool_type: string;
  devices: {
    device_name: string;
    status: string;
    sw_license: string;
    sw_valid_date: string;
    sw_key: string;
    vn_no: string;
    vn_route_num_can: string;
    vn_route_num_lin: string;
    vn_route_num_eth: string;
    model: string;
  }[];
}
[];

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11868 */
/** GetDevicesInPool POST /GetDevicesInPool */
export async function postGetdevicesinpool(
  params?: IPostGetdevicesinpoolParams,
): Promise<IPostGetdevicesinpoolResponse> {
  return request<IPostGetdevicesinpoolResponse>('/GetDevicesInPool', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params || {},
  });
}

/** GetResourceBinded - 请求参数 */
export interface IGetresourcesbindedParams {
  pc_name: string; // 查询参数
}

/** GetResourceBinded - 响应数据 */
export interface IGetresourcesbindedResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11865 */
/** GetResourceBinded GET /GetResourcesBinded */
export async function getresourcesbinded(
  params: IGetresourcesbindedParams,
): Promise<IGetresourcesbindedResponse> {
  return request<IGetresourcesbindedResponse>('/GetResourcesBinded', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
  });
}

/** GetResources - 请求参数 */
export interface IGetresourcesParams {}

/** GetResources - 响应数据 */
export interface IGetresourcesResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11862 */
/** GetResources GET /GetResources */
export async function getresources(params?: IGetresourcesParams): Promise<IGetresourcesResponse> {
  return request<IGetresourcesResponse>('/GetResources', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params || {},
  });
}

/** UpdateDeviceInfo - 请求参数 */
export interface IPostUpdatedeviceinfoParams {}

/** UpdateDeviceInfo - 响应数据 */
export interface IPostUpdatedeviceinfoResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11877 */
/** UpdateDeviceInfo POST /UpdateDeviceInfo */
export async function postUpdatedeviceinfo(
  params?: IPostUpdatedeviceinfoParams,
): Promise<IPostUpdatedeviceinfoResponse> {
  return request<IPostUpdatedeviceinfoResponse>('/UpdateDeviceInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params || {},
  });
}

/** 测试资源当前使用情况列表 - 请求参数 */
export interface IGetHttp192168174249001TraceMatrixResourceuseParams {}

/** 测试资源当前使用情况列表 - 响应数据 */
export interface IGetHttp192168174249001TraceMatrixResourceuseResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11913 */
/** 测试资源当前使用情况列表 GET /http://192.168.174.24:9001/trace_matrix/resourceuse */
export async function getHttp192168174249001TraceMatrixResourceuse(
  params?: IGetHttp192168174249001TraceMatrixResourceuseParams,
): Promise<IGetHttp192168174249001TraceMatrixResourceuseResponse> {
  return request<IGetHttp192168174249001TraceMatrixResourceuseResponse>(
    '/http://192.168.174.24:9001/trace_matrix/resourceuse',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: params || {},
    },
  );
}

/** 资源台架预约使用率列表 - 请求参数 */
export interface IPostTraceMatrixResourceusageChartfliterParams {}

/** 资源台架预约使用率列表 - 响应数据 */
export interface IPostTraceMatrixResourceusageChartfliterResponse {}

/** @see http://iauto-yapi.ci.iauto.com/project/548/interface/api/11886 */
/** 资源台架预约使用率列表 POST /trace_matrix/resourceusage-chartfliter/ */
export async function postTraceMatrixResourceusageChartfliter(
  params?: IPostTraceMatrixResourceusageChartfliterParams,
): Promise<IPostTraceMatrixResourceusageChartfliterResponse> {
  return request<IPostTraceMatrixResourceusageChartfliterResponse>(
    '/trace_matrix/resourceusage-chartfliter/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params || {},
    },
  );
}
