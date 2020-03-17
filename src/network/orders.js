import { request } from "./request";

// 获取订单数据
export function getOrdersRequest(data) {
  return request.get("/orders", { params: data });
}

// 获取物流数据
export function getProgressRequest() {
  return request.get("/kuaidi/804909574412544580");
}

// 根据ID获取订单详情
export function getOrdersByIdRequest(id) {
  return request.get("/orders/" + id);
}

// 修改订单状态
export function editOrdersRequest(id, form) {
  return request.put("/orders/" + id, form);
}
