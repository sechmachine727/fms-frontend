import { del, get, post, put } from "../axios";
const url = "/training-calendar";
class TrainingCalendar {
    get = (params) => {
        return get(url, { params });
    };

    getAllCalendarByGroupId = (id) => {
        const newUrl = url + `/display/${id}`;
        return get(newUrl);
    };

    getAllTopicsByGroupId = (id) => {
        const newUrl = url + `/topics/${id}`;
        return get(newUrl);
    };

    getAllPresets = () => {
        const newUrl = url + `/presets`;
        return get(newUrl);
    }

    getAllTopics = () => {
        const newUrl = url + `/topics`;
        return get(newUrl);
    }

    getAllTrainers = () => {
        const newUrl = url + `/trainers`;
        return get(newUrl);
    }
    post = (data) => {
        const newUrl = url + `/generate`;
        const result = post(newUrl, data);
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
}

const trainingCalendarApi = new TrainingCalendar();
export default trainingCalendarApi;