import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'https://home.doctor-dog.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可在此添加 token 等
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败'
    console.error('[Request Error]', message)
    return Promise.reject(error)
  }
)

export default request

// 便捷方法
export const get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  request.get<T>(url, config)

export const post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  request.post<T>(url, data, config)

export const put = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  request.put<T>(url, data, config)

export const del = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  request.delete<T>(url, config)
