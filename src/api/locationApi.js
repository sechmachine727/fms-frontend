import { get } from '../axios'

const url = '/locations'

class LocationAPI {
  getAllBySiteId = (id) => {
    const newUrl = url + '/site' + `/${id}`
    return get(newUrl)
  }
}

const locationApi = new LocationAPI()
export default locationApi
