import { get } from "../axios";
const url = "/technical-groups";
class TechnicalGroup {
  get = (params) => {
    return get(url, { params });
  };

}

const technicalGroupApi = new TechnicalGroup();
export default technicalGroupApi;