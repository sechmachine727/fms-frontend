import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: (params) => queryString.stringify(params)
})

export const post = async (path, data = {}, params = {}) => {
  const response = await axiosClient.post(path, data, params)
  return response
}
