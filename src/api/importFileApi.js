import { post } from '../axios'

const url = '/import/upload'

class ImportFileAPI {
    post = (data) => {
        return post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

}

const importFileAPI = new ImportFileAPI()
export default importFileAPI
