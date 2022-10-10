import { ApiName } from "@/src/apis/apiInfo";
import { AxiosRequestConfig } from "axios";

export const ApiRequest = new Map<string, AxiosRequestConfig>()
  .set(ApiName.GET_TREES, { method: "GET", url: "/trees" })
  .set(ApiName.GET_TREE, { method: "GET", url: "/trees/:id" });
