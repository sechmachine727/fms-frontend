import { del, get, post, put } from '../axios'

const url = "/topics";
class TopicApi {
    get = (params) => {
        return get(url, { params });
    };

    getActiveTopics = () => {
        const newUrl = url + '/active'
        return get(newUrl)
    }

    getDetail = (id) => {
        const newUrl = url + `/${id}`;
        return get(newUrl);
    };
    post = (data) => {
        const result = post(url, data);
        return result;
    };

    put = (id, data) => {
        const newUrl = url + `/${id}`;
        return put(newUrl, data);
    };

    delete = (id) => {
        const newUrl = url + `/${id}`;
        return del(newUrl);
    };

    putUpdateStatus = (id) => {
        const newUrl = url + `/change-status` + `/${id}`
        return put(newUrl)
    }
}

const topicApi = new TopicApi();
export default topicApi;
