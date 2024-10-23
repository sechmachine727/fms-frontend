import { get } from '../axios'

const url = '/sites'

class SiteAPI {
  get = (params) => {
    return get(url, { params })
  }
}

const siteApi = new SiteAPI()
export default siteApi
