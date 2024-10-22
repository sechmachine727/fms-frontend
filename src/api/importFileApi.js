import { post } from '@/axios'

const url = '/import/upload'

class ImportFileAPI {
  post = (data, confirm) => {
    const newUrl = url + '?confirm=' + confirm
    return post(newUrl, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

const importFileAPI = new ImportFileAPI()
export default importFileAPI
