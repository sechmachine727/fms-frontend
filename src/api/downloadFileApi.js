import { get } from '@/axios'

const url = '/files/download-template'

class DownloadFileAPI {
  get = (params) => {
    return get(url, {
      params,
      responseType: 'blob'
    })
  }
}

const downloadFileAPI = new DownloadFileAPI()
export default downloadFileAPI
