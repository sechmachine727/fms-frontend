import { get } from '../axios'

const url = '/format-types'

class FormatTypeApi {
  get = (params) => {
    return get(url, { params })
  }
}

const formatTypeApi = new FormatTypeApi()
export default formatTypeApi
