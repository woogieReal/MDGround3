import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiName } from "./apiInfo";
import { ApiRequest } from "./requestInfo";

export default class ApiHandler {
  private static axiosInstance: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
      "Content-type": "application/json",
    },
  });

  public static async callApi(
    apiName: ApiName,
    params?: any,
    data?: any,
    ...pathParams: (number | string)[]
  ): Promise<AxiosResponse> {
    const axiosRequest = { ...ApiRequest.get(apiName), params, data };
    let cnt = 0;

    const pathParamReg = new RegExp(/:[a-zA-Z]*/);
    while (axiosRequest.url?.match(pathParamReg)) {
      axiosRequest.url = axiosRequest.url?.replace(
        pathParamReg,
        String(pathParams[cnt])
      );
      cnt += 1;
    }
    return this.axiosInstance.request(axiosRequest);
  }
}
