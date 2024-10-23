import { get } from '../axios'

const url = '/departments'

class DepartmentApi {
  get = (params) => {
    return get(url, { params })
  }
}

const deparmentApi = new DepartmentApi()
export default deparmentApi
