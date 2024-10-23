import { get } from '../axios'

const url = '/scopes'

class ScopeAPI {
  get = (params) => {
    return get(url, { params })
  }
}

const scopeApi = new ScopeAPI()
export default scopeApi
