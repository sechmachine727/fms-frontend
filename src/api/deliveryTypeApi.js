import { get } from '../axios'

const url = '/delivery-types'

class DeliveryTypeAPI {
  get = (params) => {
    return get(url, { params })
  }
}

const deliveryTypeApi = new DeliveryTypeAPI()
export default deliveryTypeApi
