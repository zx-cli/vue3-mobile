import axios from 'axios';
import router from '@/router';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios';
import { showFailToast, showLoadingToast } from 'vant';
import { isLoad } from '@/utils';
import { getToken, loginOut } from '@/hooks/auth';

// 不需要 loading 的接口
const noloadList: any[] = [];

interface Result<T> {
  code?: number;
  returnCode?: string;
  data: T;
  msg?: string;
}

let reqNum = 0;
let loadingInstance: any;

function startLoading() {
  if (reqNum === 0) {
    loadingInstance = showLoadingToast({
      message: '加载中...',
      forbidClick: true,
    });
  }
  reqNum++;
}

function endLoading() {
  // 延迟 300ms 再调用 closeLoading 方法, 合并300ms内的请求
  // 当有请求中嵌套请求的情况也也可开启延时来解决
  // setTimeout(closeLoading, 300)
  closeLoading();
}

function closeLoading() {
  if (reqNum <= 0) return;
  reqNum--;
  if (reqNum === 0) {
    loadingInstance.close();
    console.log('结束loading');
  }
}

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance: AxiosInstance;
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_APP_HTTP_BASE_URL,
    timeout: 60000,
  };

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config) => {
        isLoad(config.url as string, noloadList) && startLoading();
        // 一般会请求拦截里面加token，用于后端的验证
        const token = getToken();
        if (token) {
          (config.headers as AxiosHeaders).set('Authorization', token);
        }
        return config;
      },
      (err: any) => {
        showFailToast(err);
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        endLoading();
        if (res.data.code !== 200 && res.data.returnCode !== '2000') {
          showFailToast(
            res.data.msg ||
              res.data.data.errorMessage ||
              '接口报错，请检查网络或联系管理员'
          );
        }

        // 系统如果有自定义code也可以在这里处理
        return res.data;
      },
      (err: any) => {
        endLoading();
        // 这里用来处理http常见错误，进行全局提示
        let message = '';
        switch (err.response.status) {
          case 400:
            message = '请求错误(400)';
            break;
          case 401:
            message = '未授权，请重新登录(401)';
            // 这里可以做清空storage并跳转到登录页的操作
            loginOut();
            router.push('/login');
            break;
          case 403:
            message = '拒绝访问(403)';
            break;
          case 404:
            message = '请求出错(404)';
            break;
          case 408:
            message = '请求超时(408)';
            break;
          case 500:
            message = '服务器错误(500)';
            break;
          case 501:
            message = '服务未实现(501)';
            break;
          case 502:
            message = '网络错误(502)';
            break;
          case 503:
            message = '服务不可用(503)';
            break;
          case 504:
            message = '网络超时(504)';
            break;
          case 505:
            message = 'HTTP版本不受支持(505)';
            break;
          default:
            message = `连接出错(${err.response.status})!`;
        }
        // 这里错误消息可以使用全局弹框展示出来
        showFailToast(`${message}，请检查网络或联系管理员！`);
        // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
        return Promise.reject(err.response);
      }
    );
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.delete(url, config);
  }
}

// 默认导出Request实例
export default new Request({});
