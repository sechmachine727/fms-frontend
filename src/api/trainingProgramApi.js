import { del, get, post, put } from '@/axios'

const url = '/training-programs'

class TrainingProgramApi {
    get = (params) => {
        return get(url, { params })
    }

    getDetail = (id) => {
        const newUrl = url + `/${id}`
        return get(newUrl)
    }
     getAllByTechnicalGroupId = (id) => {
        const newUrl = url + "/technical-group" + `/${id}`
        return get(newUrl)
    }
    post = (data) => {
        const result = post(url, data)
        return result
    }

    put = (id, data) => {
        const newUrl = url + `/${id}`
        return put(newUrl, data)
    }

    putUpdateStatus = (id) => {
        const newUrl = url + `/toggle-activate` + `/${id}`
        return put(newUrl)
    }

    putToggleReviewingToDeclined = (id, reason) => {
        const newUrl = url + `/decline/${id}/` + reason 
        return put(newUrl)
    }

    putToggleActivate = (id) => {
        const newUrl = url + `/approve/${id}`
        return put(newUrl)
    }

    delete = (id) => {
        const newUrl = url + `/${id}`
        return del(newUrl)
    }
}

const trainingProgramApi = new TrainingProgramApi()
export default trainingProgramApi
