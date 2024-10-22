import { get } from '../axios'

const url = '/trainee-types'

class TraineeTypeAPI {
  get = (params) => {
    return get(url, { params })
  }
}

const traineeTypeApi = new TraineeTypeAPI()
export default traineeTypeApi
