// index.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { refreshToken } from './user'

type Result<T> = {
  code: number
  message: string
  result: T
}

let refreshing = false
let queue: { config: any; resolve: (value: unknown) => void }[] = []

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance: AxiosInstance
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = { baseURL: 'http://localhost:3000/', timeout: 5000 }

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.request.use(
      (config: any) => {
        // 一般会请求拦截里面加token，用于后端的验证
        const token = localStorage.getItem('token') as string
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token
        }

        return config
      },
      (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err)
      }
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理

        return res.data
      },
      async (error: any) => {
        const { data, config } = error.response

        if (refreshing) {
          return new Promise((resolve) => {
            queue.push({
              config,
              resolve
            })
          })
        }

        if (data.code === 401 && !config.url.includes('/user/refresh')) {
          refreshing = true

          const res = await refreshToken()

          refreshing = false

          if (res.status === 200) {
            queue.forEach(({ config, resolve }) => {
              resolve(this.instance(config))
            })
            queue = []
            return this.instance(config)
          } else {
            message.error('登录已过期,请重新登录')
            setTimeout(() => {
              window.location.href = '/login'
            }, 1500)
          }
        } else {
          message.error(error.response.data.message)

          return Promise.reject(error.response)
        }
      }
    )
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.get(url, config)
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.post(url, data, config)
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.put(url, data, config)
  }

  public delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.delete(url, config)
  }
}

// 默认导出Request实例
export default new Request({})
