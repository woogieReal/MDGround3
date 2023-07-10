import { ApiName } from "@/src/apis/apiInfo";
import { AxiosRequestConfig } from "axios";

export const ApiRequest = new Map<string, AxiosRequestConfig>()
  .set(ApiName.GET_TREES, { method: "GET", url: "/trees" })
  .set(ApiName.GET_TREE, { method: "GET", url: "/trees/:id" })
  .set(ApiName.UPDATE_TREE, { method: "PUT", url: "/trees/:id" })
  .set(ApiName.CREATE_TREE, { method: "POST", url: "/trees" })
  .set(ApiName.DELETE_TREE, { method: "DELETE", url: "/trees" })
  .set(ApiName.CUT_TREE, { method: "PUT", url: "/trees/path" })
;
