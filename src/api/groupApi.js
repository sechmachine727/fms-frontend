import { del, get, post, put } from '../axios'

const url = '/groups'

class ClassApi {
  get = (params) => {
    if (params === undefined) {
      params = ''
    }
    const newUrl = url + '?search=' + params
    return get(newUrl, { params })
  }

  getDetail = (id) => {
    const newUrl = url + `/${id}`
    return get(newUrl)
  }
  post = (data) => {
    const result = post(url, data)
    return result
  }

  put = (id, data) => {
    const newUrl = url + `/${id}`
    return put(newUrl, data)
  }

  delete = (id) => {
    const newUrl = url + `/${id}`
    return del(newUrl)
  }
}

const classApi = new ClassApi()
export default classApi
