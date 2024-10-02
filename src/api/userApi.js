import { del, get, post, put } from "../axios";
const url = "/users";
class UserApi {
  get = (search) => {
    if (search === undefined) {
      search = ""
    }
    const newUrl = url + "?search=" + search
    return get(newUrl, { search });
  };

  getDetail = (id) => {
    const newUrl = url + `/${id}`;
    return get(newUrl);
  };
    getAllClassAdmins = () => {
    const newUrl = url + "/class-admins";
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

  putUpdateStatus = (id) => {
    const newUrl = url + `/change-status` + `/${id}`;
    return put(newUrl);
  };

  delete = (id) => {
    const newUrl = url + `/${id}`;
    return del(newUrl);
  };
}

const userApi = new UserApi();
export default userApi;