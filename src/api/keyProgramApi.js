import { get } from "../axios";
const url = "/key-programs";
class KeyProgramAPI {
  get = (params) => {
    return get(url, { params });
  };

}

const keyProgramApi = new KeyProgramAPI();
export default keyProgramApi;