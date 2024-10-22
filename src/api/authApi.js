import { post } from '../axios'

const url = '/login'

class AuthApi {
  post = (data) => {
    const result = post(url, data)
    return result
  }
}

const authApi = new AuthApi()
export default authApi
