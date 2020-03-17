import { request } from "./request";

// 获取数据报表数据
export function getReportsRequest() {
  return request.get("/reports/type/1");
}
