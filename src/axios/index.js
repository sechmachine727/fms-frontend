import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  paramsSerializer: (params) => queryString.stringify(params)
})

/**
 * GET action
 * @param {*} path đường dẫn api
 * @param {*} params params
 * @returns
 */
export const get = async (path, params = {}) => {
  const response = await axiosClient.get(path, params)
  return response.data
}

/**
 * POST action
 * @param {*} path đường dẫn api
 * @param {*} data dữ liệu truyền vào body
 * @param {*} params
 * @returns
 */
export const post = async (path, data = {}, params = {}) => {
  const response = await axiosClient.post(path, data, params)
  return response
}

/**
 * PUT action
 * @param {*} path đường dẫn api
 * @param {*} data dữ liệu truyền vào body
 * @param {*} params param
 * @returns
 */
export const put = async (path, data = {}, params = {}) => {
  const response = await axiosClient.put(path, data, params)
  return response
}

/**
 * Delete action
 * @param {*} path đường dẫn api
 * @param {*} params params
 * @returns
 */
export const del = async (path, params = {}) => {
  const response = await axiosClient.delete(path, params)
  return response
}
