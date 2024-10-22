import { del, get, post, put } from '../axios'

const url = '/trainees'

class TraineeApi {
  get = (params) => {
    return get(url, { params })
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

const traineeApi = new TraineeApi()
export default traineeApi
